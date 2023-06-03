import React, { useState } from 'react';
import Button from "./Button";
import TextInput from './TextInput';
import Styles from '../css/SurveyItem.module.css';




function SurveyItem(props) {

    const { question, onDelete ,Index} = props;
 
    const [editMode, setEditMode] = useState(false);
    const [editedTitle, setEditedTitle] = useState(question.title );
    const [editedOptions, setEditedOptions] = useState(
        (question.type === "multipleChoice") ? question.options : []
    );
    
    
    
    
    function handleOptionChange(index) {
        return function(e) {
            const newOptions = [...editedOptions];
            newOptions[index].text = e.target.value;
            setEditedOptions(newOptions);
        }
    }

    function handleOptionDelete(index) {
        return function() {
            const newOptions = editedOptions.filter((_, i) => i !== index);
            setEditedOptions(newOptions);
        }
    }

    function handleDeleteClick() {
       
        onDelete(question.hasOwnProperty("num") ? question.num : [] , question.id);
    }

  //   function handleDeleteModifyClick() {
  //     onDelete(question.id);
  // }

    function handleEditClick() {
        if (editMode) {
            // Apply changes here if needed
            question.title = editedTitle;
        }
        setEditMode(!editMode);
    }

    function handleTitleChange(e) {
        setEditedTitle(e.target.value);
    }



    function renderOptions() {
      // Create a copy of editedOptions and add new options if necessary
      const optionsToRender = [...question.options];
      while (optionsToRender.length < 5) {
        optionsToRender.push({ text: "" });
      }
    
      return optionsToRender.map((option, index) => {
        return (
          <div key={index}>
            {editMode && (
              <div>
                <label>
                  <input type="radio" name="myCheckbox" value="true" required />
                  &nbsp;Option {index + 1}:{' '}
                  <input
                    type="text"
                    value={option.text}
                    onChange={handleOptionChange(index)}
                  />
                  {optionsToRender.length > 1 && <Button onClick={handleOptionDelete(index)} title="Delete option" />}
                </label>
              </div>
            )}
            {!editMode && option.text && (
              <div>
                <input type="radio" name="myCheckbox" value="true" required />
                {option.text}
              </div>
            )}
          </div>
        );
      });
    }
    



    switch (question.type) {
        case "shortAnswer":
          return (
            <div className={Styles.surveyItem}>
                    <h2 className={Styles.questionNumber}>Q.{Index}</h2>
                    <p className={Styles.questionTitle}>질문:
                        {editMode ? 
                            <TextInput value={editedTitle} onChange={handleTitleChange} /> 
                            : 
                            question.title}

              </p>
              <TextInput type="text" name="shortAnswerInput" required />
              <Button
                className={Styles.editButton}
                onClick={handleEditClick}
                title={editMode ? "Apply" : "Edit"}
              ></Button>
              &nbsp;&nbsp;
              <Button
                className={Styles.deleteButton}
                onClick={handleDeleteClick}
                title="Delete"
              ></Button>
            </div>
          );

          case "multipleChoice":
            return (
                <div className={Styles.surveyItem}>
                    <h2 className={Styles.questionNumber}>Q.{Index}</h2>
                    <p className={Styles.questionTitle}>질문: 
                        {editMode ? 
                            <TextInput value={editedTitle} onChange={handleTitleChange} /> 
                            : 
                            question.title
                        }
                    </p>
                    {renderOptions()}

                    <Button
                className={Styles.editButton}
                onClick={handleEditClick}
                title={editMode ? "Apply" : "Edit"}
              ></Button>
              &nbsp;&nbsp;
              <Button
                className={Styles.deleteButton}
                onClick={handleDeleteClick}
                title="Delete"
              ></Button>
            </div>

               
            );
      
        case "yesOrNo":
            return (
                <div className={Styles.surveyItem}>
                    <h2 className={Styles.questionNumber}>Q.{Index}</h2>
                    <p className={Styles.questionTitle}>질문: 
                        {editMode ? 
                            <TextInput value={editedTitle} onChange={handleTitleChange} /> 
                            : 
                            question.title
                        }
                    </p>
                    <form>
                        <input type="radio" name="myCheckbox" value="true" required /> 참
                        <input type="radio" name="myCheckbox" value="false" required /> 거짓
                        <br />
                    </form>

                    <Button className={Styles.editButton} onClick={handleEditClick} title={editMode ? "Apply" : "Edit"}></Button>
                    &nbsp;&nbsp;
                    <Button className={Styles.deleteButton} onClick={handleDeleteClick} title="Delete"></Button>

                </div>
            );
    }


}

export default SurveyItem;