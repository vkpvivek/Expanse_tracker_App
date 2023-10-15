const myForm=document.querySelector('#my-form');
const emailInput = document.querySelector('#email');


myForm.addEventListener('submit',onSubmit);

function onSubmit(e){
    e.preventDefault();


    if(emailInput.value === '') {
        console.log("enter all field");
    } 
    else {

        let myObj={
            email:emailInput.value
        };
        console.log(myObj);

        axios.post("http://localhost:3000/forgotPassword",myObj)
            .then((response)=>{
                console.log(response.data);              
            })
            .catch((err)=>{
                console.log(err);
            })
        

    }  
}