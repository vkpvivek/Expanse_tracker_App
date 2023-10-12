
const myForm = document.querySelector('#my-form');
const amountInput = document.querySelector('#amount');
const describeInput = document.querySelector('#describe');
const categoryInput=document.querySelector('#category')
//const msg = document.querySelector('.msg');
// var ItemList=document.getElementById('userDetail');



const premium=document.querySelector('#premium');
premium.addEventListener('click', premiumClick);

async function premiumClick(e) {

    console.log("premium Feature");
    
    const token=localStorage.getItem('Token');

    //const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInVzZXJuYW1lIjoic2FtYXIiLCJpc1ByZW1pdW1Vc2VyIjp0cnVlLCJpYXQiOjE2OTY5Mzk1MjF9.pRkbzK3Ld6lTUDiU_ZJbJWh71jOFKFynT-BkjEvFNN8";

    const response=await axios.get('http://localhost:3000/purchase',{ headers :{"Authorization":token}});

    console.log(response.data);
    console.log("key_Id: "+response.data.key_id);
    console.log("Order_Id: "+response.data.order.id);
    console.log("------------------------------------");

    var options=
    {
        "key":response.data.key_id,
        "order_id":response.data.order.id,
        //this will handle success payment
        "handler": async function(response){
            await axios.post('http://localhost:3000/updateTransactionStatus',{
                order_id:options.order_id,
                payment_id:response.razorpay_payment_id
            },{ headers :{"Authorization":token}})

            alert("you are premium User Now");
            showPremiumUser();
        },
    };
    
    console.log("------------------------------------");
    // console.log(options);

    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed',function(response){
        console.log(response)
        alert('Something went wrong')
    });

}


function showPremiumUser(){
    document.getElementById('premium').style.visibility="hidden";
    document.getElementById('PremiumUser').innerHTML="Prime User";
    showLeaderBoard();
    // document.getElementById('leaderboard').innerHTML="Leaderboard";
}


function showLeaderBoard(){
    const parElem=document.getElementById('prime');
    const LInput=document.createElement('button');
    LInput.className='btn btn-outline-success float-right';
    LInput.appendChild(document.createTextNode('Leaderboard'));


    LInput.onclick =async()=>{
        console.log("---leaderboard---");

        const token=localStorage.getItem('Token');
        console.log(token);

        const userLeaderBoard= await axios.get("http://localhost:3000/showLeaderBoard",{ headers :{"Authorization":token}})

        //console.log(userLeaderBoard.data);

        for( var i=0;i<userLeaderBoard.data.length;i++){
            LeaderBoardUI(userLeaderBoard.data[i]);
        }
    }

    parElem.appendChild(LInput);
}

function LeaderBoardUI(obj){
    const parElem=document.getElementById('leaderboardDetails');
    const childElem=document.createElement('li');
    childElem.className='list-group-item';

    childElem.textContent="₹"+obj.totalCost +" -- "+obj.username;

    parElem.appendChild(childElem);
}


function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}



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
        const token=localStorage.getItem('Token');
        //const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInVzZXJuYW1lIjoic2FtYXIiLCJpc1ByZW1pdW1Vc2VyIjp0cnVlLCJpYXQiOjE2OTY5Mzk1MjF9.pRkbzK3Ld6lTUDiU_ZJbJWh71jOFKFynT-BkjEvFNN8";        const token=localStorage.getItem('Token');
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

    //const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInVzZXJuYW1lIjoic2FtYXIiLCJpc1ByZW1pdW1Vc2VyIjp0cnVlLCJpYXQiOjE2OTY5Mzk1MjF9.pRkbzK3Ld6lTUDiU_ZJbJWh71jOFKFynT-BkjEvFNN8";
    const token=localStorage.getItem('Token');
    const decodeToken =parseJwt(token);
    const isPremium=decodeToken.isPremiumUser;
    if(isPremium){
        showPremiumUser();
    }

    
    // axios.get("http://localhost:3000/get-expanse",{ headers :{"Authorization":token}})
    //     .then((response)=>{
    //         console.log(response.data.newExpanseDetails);
    //         for( var i=0;i<response.data.newExpanseDetails.length;i++){
    //             showUser(response.data.newExpanseDetails[i]);
    //         }
    //     })
    //     .catch((err)=>{
    //         console.log(err);
    //     })
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
        //const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInVzZXJuYW1lIjoic2FtYXIiLCJpc1ByZW1pdW1Vc2VyIjp0cnVlLCJpYXQiOjE2OTY5Mzk1MjF9.pRkbzK3Ld6lTUDiU_ZJbJWh71jOFKFynT-BkjEvFNN8";
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