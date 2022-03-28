const taskContainer=document.querySelector(".task__container");         

let globalTaskdata=[];


const generateHTML=(taskData) =>
`<div id=${taskData.id} class="col-md-6 col-lg-4 my-4">
            <div class="card ">
            <div class="card-header d-flex justify-content-end gap-2 ">
                <button class="btn btn-outline-info "  name=${taskData.id} onclick="editCard.apply(this,arguments)">
                    <i class="fal fa-pencil"  name=${taskData.id} ></i></button>


                <button class="btn btn-outline-danger" name=${taskData.id} onclick="deleteCard.apply(this,arguments)">
                    <i class="far fa-trash-alt" name=${taskData.id}></i></button>
            </div>
            <div class="card-body">
                <img src="${taskData.image}" alt="image" class="card-img">
                <h5 class="card-title mt-4">${taskData.title}</h5>
                <p class="card-text">${taskData.description}</p>
                <span class="badge bg-primary">${taskData.type}</span></h6>
            </div>

            <div class="card-footer text-muted">
                <button class="btn btn-outline-primary" name=${taskData.id}>Open Task</button>
            </div>
        </div>
        </div>`;

const insertDom=(co)=>taskContainer.insertAdjacentHTML("beforeend",co);

const saveToLocalStorage=()=>
{
    localStorage.setItem("pk",JSON.stringify({cards:globalTaskdata}));

}
const addNewCard=() =>
{
    const taskData ={
        id:`${Date.now()}`,
        title:document.getElementById('taskTitle').value,
        image:document.getElementById("imageURL").value,
        type: document.getElementById("taskType").value,
        description:document.getElementById("TaskDescription").value
    };
    globalTaskdata.push(taskData);
    saveToLocalStorage();

    const newCard=generateHTML(taskData) 
    insertDom(newCard);
    document.getElementById('taskTitle').value="";
    document.getElementById("imageURL").value="";
    document.getElementById("taskType").value="";
    document.getElementById("TaskDescription").value="";
    return;

};

const refresh = () =>
{
const getData=localStorage.getItem("pk");
if(!getData)
return;
const ourcards=JSON.parse(getData);
globalTaskdata=ourcards.cards;
globalTaskdata.map((taskData)=>{
const newCard=generateHTML(taskData);
insertDom(newCard);
});
return;

};

const deleteCard=(event)=>
{
    const targetId=event.target.getAttribute("name");
    const elementType=event.target.tagName;
    const removeTask=globalTaskdata.filter((task) => task.id!==targetId);
    globalTaskdata=removeTask;
    saveToLocalStorage();


    if(elementType==="BUTTON")
    {
        return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode);
    }
    else
    {
        return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode.parentNode);
    }
    return;
};
const editCard=(event)=>
{   
    const elementType=event.target.tagName;
    let taskTitle;
    let taskType;
    let taskDescription;
    let parentElement;
    let submitButton;
     if(elementType==="BUTTON")
     {
         parentElement=event.target.parentNode.parentNode;
     }
     else{
         parentElement=event.target.parentNode.parentNode.parentNode
     }
     taskTitle=parentElement.childNodes[3].childNodes[3];
     taskDescription=parentElement.childNodes[3].childNodes[5];
     taskType=parentElement.childNodes[3].childNodes[7];
     submitButton=parentElement.childNodes[5].childNodes[1];
     taskTitle.setAttribute("contenteditable","true");
     taskDescription.setAttribute("contenteditable","true");
     taskType.setAttribute("contenteditable","true");
     submitButton.setAttribute("onclick","saveEdit.apply(this,arguments)");
     submitButton.innerHTML="Save Changes";
};
const saveEdit=(event)=>
{
    const targetId=event.target.getAttribute("name");
    const elementType=event.target.tagName;

    let parentElement;

     if(elementType==="BUTTON")
     {
         parentElement=event.target.parentNode.parentNode;
     }
     else{
         parentElement=event.target.parentNode.parentNode.parentNode;
     }

    const taskTitle=parentElement.childNodes[3].childNodes[3];
    const taskDescription=parentElement.childNodes[3].childNodes[5];
    const taskType=parentElement.childNodes[3].childNodes[7];
    const submitButton=parentElement.childNodes[5].childNodes[1];

    const updatedData={
        title:taskTitle.innerHTML,
        type:taskType.innerHTML,
        description:taskDescription.innerHTML,
    };

    const globalTaskUpdated= globalTaskdata.map((task)=>
    {
        if(task.id===targetId)
        {
            return {...task,...updatedData};
        }
        return task;
    });
    globalTaskdata=globalTaskUpdated;

     saveToLocalStorage();

    taskTitle.setAttribute("contenteditable","false");
    taskDescription.setAttribute("contenteditable","false");
    taskType.setAttribute("contenteditable","false");
    submitButton.innerHTML="Open Task";
}