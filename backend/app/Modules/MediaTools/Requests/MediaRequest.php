<?php

namespace App\Modules\MediaTools\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class MediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Detect when PHP has silently rejected the upload (file too large for
     * upload_max_filesize / post_max_size) before Laravel validation runs.
     */
    protected function prepareForValidation(): void
    {
        // When PHP's upload_max_filesize or post_max_size is exceeded the
        // $_FILES superglobal is empty but the request body is non-zero.
        // CONTENT_LENGTH > 0 but no file means PHP dropped it server-side.
        $contentLength = (int) $this->server('CONTENT_LENGTH', 0);
        $hasFile = $this->hasFile('file') || $this->hasFile('files');

        if ($contentLength > 0 && !$hasFile) {
            // Check if PHP actually received the upload but rejected it due to local upload_max_filesize
            $file = $this->file('file') ?? (is_array($this->file('files')) ? $this->file('files')[0] : null);
            if ($file && !$file->isValid() && $file->getError() === UPLOAD_ERR_INI_SIZE) {
                $maxSize = ini_get('upload_max_filesize');
                throw new HttpResponseException(
                    response()->json([
                        'success' => false,
                        'message' => "Local PHP limit hit! Your server's upload_max_filesize is only {$maxSize}. Please increase it in your local php.ini to upload this file.",
                    ], 413)
                );
            }

            // Otherwise, it was dropped entirely (post_max_size exceeded or Nginx 413)
            throw new HttpResponseException(
                response()->json([
                    'success' => false,
                    'message' => 'File is too large for the server to accept (post_max_size exceeded). Please upload a smaller file.',
                ], 413)
            );
        }
    }

    public function rules(): array
    {
        $action = $this->route('action');

        // Very permissive — accept any file for media tools.
        // PHP upload_max_filesize and post_max_size control the real size limit.
        $rules = [
            'file' => ['required', 'file', 'max:524288'], // 512MB in KB
        ];

        switch ($action) {
            case 'wav-to-mp3':
            case 'mov-to-mp3':
                $rules['bitrate'] = ['sometimes', 'integer', 'in:128,192,256,320'];
                break;

            case 'extract-audio':
                $rules['format'] = ['sometimes', 'string', 'in:mp3,wav'];
                break;

            case 'compress-video':
                $rules['quality'] = ['sometimes', 'string', 'in:low,medium,high'];
                break;

            case 'trim-audio':
            case 'trim-video':
                $rules['start']    = ['sometimes', 'string'];
                $rules['duration'] = ['sometimes', 'string'];
                break;

            case 'video-to-gif':
                $rules['fps']   = ['sometimes', 'integer', 'min:5', 'max:30'];
                $rules['width'] = ['sometimes', 'integer', 'min:100', 'max:1920'];
                break;

            case 'change-audio-speed':
                $rules['speed'] = ['sometimes', 'string'];
                break;
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'file.required' => 'Please select a file to upload.',
            'file.max'      => 'File is too large. Maximum size is 512MB.',
        ];
    }
}
