
const myForm = document.querySelector('#my-form');
const amountInput = document.querySelector('#amount');
const describeInput = document.querySelector('#describe');
const categoryInput=document.querySelector('#category');
const pagination=document.querySelector('#Pagination');
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
            const res= await axios.post('http://localhost:3000/updateTransactionStatus',{
                order_id:options.order_id,
                payment_id:response.razorpay_payment_id
            },{ headers :{"Authorization":token}})

            alert("you are premium User Now");
            showPremiumUser();
            console.log(res+"  ...................");
            localStorage.setItem("Token",res.data.token);
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
    downloadReport();
    // document.getElementById('leaderboard').innerHTML="Leaderboard";
}


function downloadReport(){
    const parElem=document.getElementById('prime');
    const LInput=document.createElement('button');
    LInput.className='btn btn-outline-success float-right';
    LInput.appendChild(document.createTextNode('DownLoad'));


    LInput.onclick =async()=>{

        console.log("---downloaded---");
        const token=localStorage.getItem('Token');

        axios.get('http://localhost:3000/download',{ headers: {"Authorization" : token} })
        .then((response) => {
            if(response.status === 200){
                //the bcakend is essentially sending a download link, 
                //which if we open in browser, the file would download
                var a = document.createElement("a");
                a.href = response.data.fileURL;
                console.log(a);
                a.download = 'myexpense.csv';
                a.click();
                //console.log(response.data.fileURL);

            } else {
                console.log("error");
            }
            //console.log(response.data.fileUrl);
        })
        .catch((err) => {
            console.log(err);
        });

    }

    parElem.appendChild(LInput);
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
            //
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

    const page=1;

    console.log("test");

    // const currentPage=2,hasNextPage=true,nextPage=3,hasPreviousPage=true,previousPage=1,lastPage=5;
    // showPagination({currentPage,
    //     hasNextPage,
    //     nextPage,
    //     hasPreviousPage,
    //     previousPage,
    //     lastPage}
    // );

    //axios.get(`http://localhost:3000/get-expanse`,{ headers :{"Authorization":token}})
    axios.get(`http://localhost:3000/get-expanse?page=${page}`,{ headers :{"Authorization":token}})
        .then((response)=>{
            console.log(response.data.newExpanseDetails);
            for( var i=0;i<response.data.newExpanseDetails.length;i++){
                showUser(response.data.newExpanseDetails[i]);
            }
            console.log(response.data);
            showPagination(response.data);
        })
        .catch((err)=>{
            console.log(err);
        })
})

//const currentPage=2,hasNextPage=true,nextPage=3,hasPreviousPage=true,previousPage=1,lastPage=5;

function showPagination({
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    previousPage,
    lastPage,
}){
    pagination.innerHTML='';

    if(hasPreviousPage){
        const btn2=document.createElement('button');
        btn2.innerHTML=previousPage
        btn2.addEventListener('click',()=> getExpanse(previousPage))
        pagination.appendChild(btn2);
    }

    const btn1=document.createElement('button');
    btn1.innerHTML=`<h3>${currentPage}</h3>`
    btn1.addEventListener('click',()=> getExpanse(currentPage))
    pagination.appendChild(btn1);

    if(hasNextPage){
        const btn3=document.createElement('button');
        btn3.innerHTML=nextPage
        btn3.addEventListener('click',()=> getExpanse(nextPage))
        pagination.appendChild(btn3);
    }
}

function getExpanse(page){

    const token=localStorage.getItem('Token');
    axios.get(`http://localhost:3000/get-expanse?page=${page}`,{ headers :{"Authorization":token}})
        .then((response)=>{
            console.log(response.data.newExpanseDetails);
            for( var i=0;i<response.data.newExpanseDetails.length;i++){
                showUser(response.data.newExpanseDetails[i]);
            }
            showPagination(response.data);
        })
        .catch((err)=>{
            console.log(err);
        })
}

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