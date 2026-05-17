"use client"

import { TinyEditorProps } from "@/interfaces/tinyEditorType/tinyEditorType";
import { Editor } from "@tinymce/tinymce-react";

export default function TinyEditor({value, onChange}: TinyEditorProps) {
    return(
        <Editor
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
            id="tiny-editor"
            value={value}
            onEditorChange={(content) => onChange(content)}
            init={{
                height: 300,
                resize: false,
                menubar: false,
                skin: "oxide-dark",
                content_css: "dark",
                // plugins: [
                //     "advlist", "autolink", "lists", "link", "charmap", "preview", "searchreplace", "visualblocks", "code", "fullscreen","insertdatetime", "table", "wordcount"
                // ],
                // toolbar: [
                //     "undo redo | formatselect | bold italic underline | " +
                //     "alignleft aligncenter alignright | " +
                //     "bullist numlist | removeformat | code",
                // ]
            }}
            
        />
    )
}