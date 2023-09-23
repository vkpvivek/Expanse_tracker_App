
const myForm = document.querySelector('#my-form');
const nameInput = document.querySelector('#username');
const emailInput = document.querySelector('#email');
const passInput=document.querySelector('#password');


myForm.addEventListener('submit',onSubmit);


function onSubmit(e) {
    e.preventDefault();

    let myObj={
        username:nameInput,
        email:emailInput,
        password:passInput
    }
    
    axios.post("http://localhost:4000/add-user",myObj)
        .then((res)=>{
            console.log(res);
        })
        .catch((err)=>{
            console.log(err);
        })
    
};