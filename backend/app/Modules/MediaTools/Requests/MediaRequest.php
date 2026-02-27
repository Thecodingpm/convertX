<?php

namespace App\Modules\MediaTools\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
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
