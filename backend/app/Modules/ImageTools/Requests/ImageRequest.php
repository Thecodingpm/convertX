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

        // Use mimes: (extension-based) instead of mimetypes: (finfo content check)
        // finfo-based MIME checking can fail on valid files uploaded from macOS/mobile
        $anyImage = 'mimes:jpg,jpeg,png,gif,bmp,webp,tiff,tif';

        $rules = [
            'file' => ['required', 'file', 'max:102400', $anyImage],
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
