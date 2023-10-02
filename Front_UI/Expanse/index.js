
const myForm = document.querySelector('#my-form');
const amountInput = document.querySelector('#amount');
const describeInput = document.querySelector('#describe');
const categoryInput=document.querySelector('#category')
// const msg = document.querySelector('.msg');

// var ItemList=document.getElementById('userDetail');

myForm.addEventListener('submit', onSubmit);

function onSubmit(e) {
    e.preventDefault();

    if(amountInput.value === '' || describeInput.value === '' || categoryInput.value==='') {
      msg.innerHTML = 'Please enter all fields';

    } else {

        let myObj={
            amount:amountInput.value,
            description:describeInput.value,
            categories:categoryInput.value
        };

        console.log(myObj);
        //const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY5NjE0MDQwOH0.VUAgWYvRxUrwbVxcmiCWC6ZJFKSaByLwXxtrRSHWR-Q";
        const token=localStorage.getItem('Token');
        axios.post("http://localhost:3000/add-expanse",myObj,{ headers :{"Authorization":token}})
            .then((response)=>{
                console.log(response.data.newExpanseDetails);
                showUser(response.data.newExpanseDetails)
            })
            .catch((err)=>{
                console.log(err);
            })
        //showUser(myObj);
    }  
};


window.addEventListener("DOMContentLoaded",()=>{
    const token=localStorage.getItem('Token');
    //const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY5NjE0MDQwOH0.VUAgWYvRxUrwbVxcmiCWC6ZJFKSaByLwXxtrRSHWR-Q";
    axios.get("http://localhost:3000/get-expanse",{ headers :{"Authorization":token}})
        .then((response)=>{
            console.log(response.data.newExpanseDetails);
            for( var i=0;i<response.data.newExpanseDetails.length;i++){
                showUser(response.data.newExpanseDetails[i]);
            }
        })
        .catch((err)=>{
            console.log(err);
        })
})



function showUser(obj){
    const parElem=document.getElementById('expanseDetail');
    const childElem=document.createElement('li');
    childElem.className='list-group-item';

    childElem.textContent="₹"+obj.amount +" -- "+obj.description +" -- "+obj.categories;


    //create Delete Button to add in li
    var deleteBtn = document.createElement('button');
    deleteBtn.className ='delete';
    deleteBtn.style='float:right';
    deleteBtn.appendChild(document.createTextNode('delete'));


    deleteBtn.onclick=()=>{
        const token=localStorage.getItem('Token');
        //const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY5NjE0MDQwOH0.VUAgWYvRxUrwbVxcmiCWC6ZJFKSaByLwXxtrRSHWR-Q";
        axios.delete(`http://localhost:3000/delete-expanse/${obj.id}`,{ headers :{"Authorization":token}})
            .then(response => {
                console.log(`Deleted post with ID ${obj.id}`);
            })
            .catch(error => {
                console.log("......*...");
                //console.error(error);
            });
        parElem.removeChild(childElem);
    }
    childElem.appendChild(deleteBtn);    //add delete button Li


    parElem.appendChild(childElem);

}