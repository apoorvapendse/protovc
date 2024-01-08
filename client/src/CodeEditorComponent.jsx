import React, { useEffect, useRef, useState } from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/python/python';
import 'codemirror/theme/dracula.css';
import CodeMirror from 'codemirror';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'

const CodeEditorComponent = () => {
  const editorRef = useRef(null);
  const [langID,setLangID] = useState(null);
  const [inputData,setInputData] = useState(null);//to handle the input options
  const[myEditor,setMyEditor] = useState(null)
  const[outputData,setOutputData] = useState("")


  useEffect(() => {
    const editor = CodeMirror.fromTextArea(editorRef.current, {
      mode: 'text/x-c++src',
      theme: 'dracula',
      lineNumbers: true,
      autoCloseBrackets: true,
    });

    setMyEditor(editor)

    return () => {
      editor.toTextArea();
    };
  }, []);

  const handleLanguageChange = () => {
    const selectedLanguage = document.getElementById('inlineFormSelectPref').value;
  
    if (selectedLanguage === 'Java') {
      myEditor.setOption('mode', 'text/x-java');
      setLangID(91);
    } else if (selectedLanguage === 'Python') {
      myEditor.setOption('mode', 'text/x-python');
      setLangID(92);
    } else {
      myEditor.setOption('mode', 'text/x-c++src');
      setLangID(76);
    }
  
    // Adding a delay to get the updated value of the editor
    
  };
  const handleCodingSprintClick =async () => {
    console.log("langid:",langID)
    console.log("code:",myEditor.getValue())
    console.log("input:",inputData)


    const options = {
      method: 'POST',
      url: 'https://judge0-ce.p.rapidapi.com/submissions',
      params: {
        base64_encoded: 'false',
        fields: '*'
      },
      headers: {
        'content-type': 'application/json',
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': 'f64852f721msh6583844eb044078p1ad76fjsn92846176cdf4',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      },
      data: {
        language_id: langID,
        source_code: myEditor.getValue(),
        stdin: inputData
      }
    };
    
    try {
      const response = await axios.request(options);
      if(response.status===201){
        let token = response.data.token;
        console.log(token);
        setTimeout(async()=>{
          const result = await axios.get(`https://ce.judge0.com/submissions/${token}`)
          console.log(result)
          if(result.status===200)
          {
            if(result.data.compile_output){
              alert(result.data.compile_output);
            }
            else{
              console.log(result.data.stdout)
              setOutputData(result.data.stdout)
            }
          }
          else{
            console.error("compilation")
          }
        },2000)
      }
    } catch (error) {
      console.error(error);
    }
    
    
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
              Run
            </button>
          </div>
        </div>
        <textarea
          type="text"
          id="editor"
          className="form-control"
          aria-label="Code Editor"
          ref={editorRef}
        ></textarea>
      </div>
      <div className="col d-flex flex-column rounded bg-dark px-4">
        <div className="h-50">
          <label htmlFor="Input" className="text-light mt-4 mb-2">
            Input
          </label>
          <textarea
            type="text"
            id="input"
            className="form-control h-75"
            aria-label="Input"
            onChange={(e) => setInputData(e.target.value)}
            value={inputData}
          ></textarea>
        </div>
        <div className="h-50">
          <label htmlFor="Output" className="text-light mb-3">
            Output
          </label>
          <textarea
            type="text"
            id="output"
            className="form-control h-75"
            aria-label="Output"
            value={outputData}
            onChange={(e) => setOutputData(e.target.value)}
          ></textarea>
        </div>
      </div>
    </div>
  );
};


export default CodeEditorComponent;
