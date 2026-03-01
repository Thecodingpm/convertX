<?php

namespace App\Modules\ImageTools\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $action = $this->route('action');

        // Minimal validation — downstream tools (Clipdrop, ImageMagick) validate format.
        // Avoiding MIME-type checks entirely as they cause false 422s on Railway + macOS browsers.
        $maxKb = $action === 'remove-background' ? 20480 : 51200; // 20MB for clip drop, 50MB for others

        $rules = [
            'file' => ['required', 'file', "max:{$maxKb}"],
        ];

        switch ($action) {
            case 'resize-image':
                $rules['width']  = ['required', 'integer', 'min:1', 'max:10000'];
                $rules['height'] = ['required', 'integer', 'min:1', 'max:10000'];
                break;

            case 'compress-image':
                $rules['quality'] = ['sometimes', 'integer', 'min:1', 'max:100'];
                break;

            case 'crop-image':
                $rules['width']  = ['required', 'integer', 'min:1'];
                $rules['height'] = ['required', 'integer', 'min:1'];
                $rules['x']      = ['sometimes', 'integer', 'min:0'];
                $rules['y']      = ['sometimes', 'integer', 'min:0'];
                break;

            case 'rotate-image':
                $rules['degrees'] = ['required', 'numeric'];
                break;
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'file.required' => 'Please select a file to upload.',
            'file.file' => 'The uploaded file is not valid.',
            'file.mimes' => 'Invalid file type. Please check the accepted formats for this tool.',
            'file.max' => 'File is too large. Maximum size is 100MB.',
        ];
    }
}
