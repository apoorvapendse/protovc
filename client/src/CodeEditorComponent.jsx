import React, { useEffect, useRef } from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/python/python';
import 'codemirror/theme/dracula.css';
import CodeMirror from 'codemirror';
import 'bootstrap/dist/css/bootstrap.min.css';

const CodeEditorComponent = () => {
  const editorRef = useRef(null);

  useEffect(() => {
    const editor = CodeMirror.fromTextArea(editorRef.current, {
      mode: 'text/x-c++src',
      theme: 'dracula',
      lineNumbers: true,
      autoCloseBrackets: true,
    });

    return () => {
      editor.toTextArea();
    };
  }, []);

  const handleLanguageChange = () => {
    const selectedLanguage = document.getElementById('inlineFormSelectPref').value;

    if (selectedLanguage === 'Java') {
      editor.setOption('mode', 'text/x-java');
    } else if (selectedLanguage === 'Python') {
      editor.setOption('mode', 'text/x-python');
    } else {
      editor.setOption('mode', 'text/x-c++src');
    }
  };

  const handleCodingSprintClick = () => {
    // Handle Coding Sprint button click
    // Add your logic here
  };

  return (
    <div className="row m-5 p-5 h-100">
      <div className="col">
        <div className="d-flex justify-content-between mb-2 bg-dark rounded p-2">
          <div className="col-12 w-25">
            <label className="visually-hidden" htmlFor="inlineFormSelectPref">
              Preference
            </label>
            <select
              className="form-select"
              id="inlineFormSelectPref"
              onChange={handleLanguageChange}
            >
              <option selected>Choose...</option>
              <option value="Java">Java</option>
              <option value="Cpp">Cpp</option>
              <option value="Python">Python</option>
            </select>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleCodingSprintClick}
            >
              Coding Sprint
            </button>
          
          </div>
        </div>
        <textarea type="text" id="editor" className="form-control" aria-label="Code Editor" ref={editorRef}></textarea>
      </div>
      <div className="col d-flex flex-column rounded bg-dark px-4">
        <div className="h-50">
          <label htmlFor="Input" className="text-light mt-4 mb-2">
            Input
          </label>
          <textarea type="text" id="input" className="form-control h-75" aria-label="Input"></textarea>
        </div>
        <div className="h-50">
          <label htmlFor="Output" className="text-light mb-3">
            Output
          </label>
          <textarea type="text" id="output" className="form-control h-75" aria-label="Output"></textarea>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorComponent;
