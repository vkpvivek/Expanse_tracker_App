const myForm=document.querySelector('#my-form');
const emailInput = document.querySelector('#email');
const passInput=document.querySelector('#password');

myForm.addEventListener('submit',onSubmit);

function onSubmit(e){
    e.preventDefault();

    if(emailInput.value === ''|| passInput==='') {
        //alert("Please enter all fields");
        console.log("enter all field");
    } 
    else {
        let myObj={
            email:emailInput.value,
            password:passInput.value
        };

        console.log(myObj);

        axios.post("http://localhost:3000/login",myObj)
            .then((response)=>{

                const obj=response.data.newUserDetails;
                console.log(obj);

                //if user exist
                if(obj.length>0){
                    //check if password matches
                    const pass=obj[0].password;
                    if(myObj.password==pass){
                        console.log("login successfully");
                    }else{
                        console.log("password didn't match");
                    }
                }
                else   //if user doesn't exist
                {
                    console.log("User Not Found");
                }
                
            })
            .catch((err)=>{
                console.log(err);
            })

      }  
}