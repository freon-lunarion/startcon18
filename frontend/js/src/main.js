// importing named exports we use brackets
import { createPostTile, createElement,createMyPostTile,uploadImage,getClosest,dateFormater } from './helpers.js';

// when importing 'default' exports, use below syntax
import API from './api.js';

const api  = new API();

if (api.token === null) {
    document.getElementById("main-page").style.display   = "none";
    document.getElementById("signup-page").style.display = "none";
    document.getElementById("login-page").style.display  = "block";
} else {
    document.getElementById("main-page").style.display   = "block";
    document.getElementById("login-page").style.display  = "none";
    document.getElementById("signup-page").style.display = "none";
}

let myProfilePage    = document.getElementById('my-profile-view');
let profilePage      = document.getElementById('profile-view');
let viewLikesPage    = document.getElementById('likes-view');
let viewCommentsPage = document.getElementById('comments-view');
let formCommentsPage = document.getElementById('comments-form');
let hiddenPostId     = document.getElementById('post-id');
let hiddenUsername   = document.getElementById('user-name');
let dialogCards      = document.getElementsByClassName('dialog-card');
let galleryEl        = document.getElementById('gallery');
let galleryPage      = document.getElementById('my-gallery');
let uploadForm       = document.getElementById('upload-form');
let editForm         = document.getElementById('edit-modal');

uploadForm.style.display = 'none';

let imageInput = document.querySelector('input[type="file"]');
imageInput.addEventListener('change', uploadImage);

for (var i = 0; i < dialogCards.length; i++){
    dialogCards[i].style.display = "none";
}

document.body.addEventListener('click', (event) => {
    let elm = event.target;
    
    if (elm.matches('#login-btn')) {
        let username = document.getElementById('loginUser').value;
        let password = document.getElementById('loginPass').value;
        // let username = 'Anon';
        // let password = 'bgfhdj12d10a1'
        console.log()
        api.authLogin(username,password).then(response => {
            if (api.token === null) {
                
            } else {
                
                document.getElementById("main-page").style.display = "block";
                document.getElementById("login-page").style.display = "none";
                showFeeds();
                myProfile();
                
                // console.log(api.following);
                
            }
        });

    } else if (elm.matches("#signup-btn")) {
        let username = document.getElementById('signup-user').value;
        let password = document.getElementById('signup-pass').value;
        let repass   = document.getElementById('signup-repass').value;
        let email    = document.getElementById('signup-email').value;
        if (password === repass) {
            api.authSignup(username,password, email,username).then(response => {
                if (api.token === null) {
                    
                } else {
                    document.getElementById("main-page").style.display = "block";
                    document.getElementById("signup-page").style.display = "none";
                    showFeeds();
                    myProfile();
                }
            });
            
        } else {
            alert('password and confirm password must be same');
        }

        
    } else if (elm.matches(".redirect-btn")) {
        let from_page = elm.dataset.redirectFrom;
        let to_page   = elm.dataset.redirectTo;

        document.getElementById(from_page).style.display = "none";
        document.getElementById(to_page).style.display   = "block";
        
    } else if (elm.matches(".likes-btn")) {
        for (var i = 0; i < dialogCards.length; i++){
            dialogCards[i].style.display = "none";
        }
        let postId  = elm.dataset.postId;
        let modal   = document.getElementById('likes-view');
        let content = modal.querySelector('.modal-body');
        let post    = api.getPost(postId);
        let list    = createElement('ul', null, {});

        modal.style.display = 'block';
        content.innerHTML   = '';
        // console.log(api.token);
        post.then(response => {
            
            response.meta.likes.forEach(el => {
                api.getUser(el).then(resp => {
                    list.appendChild(createElement('li',resp.username,{}));
                });
                
            });
            
        });

        content.appendChild(list);
        
    } else if (elm.matches('.send-likes-btn')) {
        
        let postId = elm.dataset.postId;
        let post = api.getPost(postId);
        let myId = document.getElementById('my-profile-user-id').value;

        post.then(res => {
            if (res.likes.indexOf(myId) < 0) {
                let numLikes = parseInt(elm.previousSibling.innerHTML);
                api.putPostLike(postId);
                elm.previousSibling.innerHTML =  parseInt(numLikes + 1);
            }
            
        })
    } else if (elm.parentNode.matches('.send-likes-btn')) {
        let postId = elm.parentNode.dataset.postId;
        let numLikes = parseInt(elm.parentNode.previousSibling.innerHTML);
        console.log(numLikes);
        api.putPostLike(postId);
        elm.parentNode.previousSibling.innerHTML =  parseInt(numLikes + 1);
    } else if (elm.matches('.comments-btn')) {
        for (var i = 0; i < dialogCards.length; i++){
            dialogCards[i].style.display = "none";
        }
        let modal = document.getElementById('comments-view');
        modal.style.display = 'block';
        let postId = elm.dataset.postId;
        let content = modal.querySelector('.modal-body');
        content.innerHTML = '';
        let post = api.getPost(postId);
        let list = createElement('ul', null, {});
        post.then(response => {

            response.comments.forEach( comment => {
                list.appendChild(createElement('li',comment.author+": "+comment.comment +" ("+ dateFormater(comment.published)+")",{}))
            });
            content.appendChild(list);
        });

    } else if (elm.matches('.send-comments-btn') || elm.parentNode.matches('.send-comments-btn')){
        for (var i = 0; i < dialogCards.length; i++){
            dialogCards[i].style.display = "none";
        }
        formCommentsPage.style.display = "block";
        let postId = elm.dataset.postId;
        hiddenPostId.value = postId;
        

    } else if (elm.matches('#save-comment-btn')) {

        let commentTxt = document.getElementById('comment-txt').value;
        let authorTxt  = document.querySelector('#my-profile-username').innerHTML;
        api.putPostComment(hiddenPostId.value,authorTxt,"1539476785.0",commentTxt)
        .then( resp => {
            // console.log(resp);
            if (resp.message === 'success') {
                let commentCountEl = document.querySelector('a.comments-btn[data-post-id="'+hiddenPostId.value+'"]');
                let commentNum     = parseInt(commentCountEl.innerHTML);
                commentCountEl.innerHTML = commentNum + 1;
                document.getElementById('comment-txt').value
            }
            
        });

    } else if (elm.matches('.user-btn')) {
        for (var i = 0; i < dialogCards.length; i++){
            dialogCards[i].style.display = "none";
        }
        let userName = elm.dataset.username;

        hiddenUsername.value = userName;

        api.getUser(null, userName).then(resposne => {
            userProfile(resposne);
        });

    } else if (elm.matches('#my-profil-btn') || elm.parentNode.matches('#my-profil-btn')) {
        for (var i = 0; i < dialogCards.length; i++){
            dialogCards[i].style.display = "none";
        }
        
        myProfilePage.style.display = "block";
    } else if (elm.matches('#my-gallery-btn') || elm.parentNode.matches('#my-gallery-btn')) {
        console.log(api.posts);
        myGallery();
        if (galleryPage.style.display === 'none'){
            galleryPage.style.display = 'block';
        } else {
            galleryPage.style.display = 'none';
        }


    } else if (elm.matches('[data-dismiss="modal"]') || elm.matches('[data-dismiss="modal"]>span')) {
        let modal = getClosest(elm, '.card')
        modal.style.display = 'none';

    } else if (elm.matches('#upload-btn') || elm.parentNode.matches('#upload-btn')) {
        let b64El  = document.getElementById('image-b64');
        let descEl = document.getElementById('image-desc');
        let b64    = b64El.value;
        let src    = b64.replace('data:image/png;base64,','');
        let desc   = descEl.value;

        api.postPost(desc,src).then(resp=> {
            let newImage = createElement('div',null,{'data-id':resp.post_id, class: 'col-md-3'});
            newImage.appendChild(
            createMyPostTile(
                resp.post_id,
                src,desc,
                (new Date).getTime()/1000,
                0,0
            ));
            galleryEl.insertBefore(newImage, galleryEl.firstChild);
        });

        imageInput.value = '';
        descEl.value     = '';
        b64El.value      = '';

        // console.log(b64);

    } else if (elm.parentNode.matches('.edit-profile')) {
        let openPage = elm.parentNode.getAttribute('href');
        let page     = document.querySelector(openPage);
        page.style.display = 'block';
    } else if (elm.matches('#save-name-btn')) {
        let modal    = getClosest(elm, '.card');
        let inputVal = document.querySelector('#new-name').value
        let payload  = {
            name: inputVal
        }

        api.putUser(payload).then(resp => {
            // console.log(resp);
            if (resp.msg === 'success') {
                document.querySelector('#my-profile-name').innerHTML = inputVal
            }
        });

        modal.style.display = 'none';


    } else if (elm.matches("#save-email-btn")) {
        let modal = getClosest(elm, '.card');
        
        let inputVal = document.querySelector('#new-email').value

        let payload = {
            email : inputVal
        }

        api.putUser(payload).then(resp => {
            // console.log(resp);
            if (resp.msg === 'success') {
                document.querySelector('#my-profile-email').innerHTML = inputVal
            }
        });

        modal.style.display = 'none';
    } else if (elm.matches("#save-pass-btn")) {
        let modal  = getClosest(elm, '.card');
        let pass   = document.querySelector('#new-pass').value;
        let repass = document.querySelector('#new-repass').value;
        
        if (pass === repass) {
            let payload = {
                password: pass
            };

            api.putUser(payload);
            modal.style.display = 'none';
        }
    } else if (elm.matches('#search-user') || elm.parentNode.matches('#search-user')) {
        let search = document.querySelector('#search-user-txt').value;
        if (search !== '') {
            api.getUser(null, search).then( result => {
                if (result.message === 'User Not Found') {
                    alert('User Not Found');
                } else {
                    userProfile(result);
                }
            });
        }
        


    } else if (elm.matches('.follow-btn')) {
        let username = elm.dataset.user;
        api.putUserFollow(username).then( resp => {
            if ( resp.message ==='success') {
                elm.style.display = 'none';
                document.querySelector('.unfollow-btn').style.display = 'inline';
            }
        });
    } else if (elm.matches('.unfollow-btn')) {
        let username = elm.dataset.user;
        api.putUserUnfollow(username).then( resp => {
            if ( resp.message === 'success') {
                elm.style.display = 'none';
                document.querySelector('.follow-btn').style.display = 'inline';
            }
        });
    } else if (elm.matches('.remove-btn') || elm.parentNode.matches('.remove-btn')) {
        let cardEL = getClosest(elm, '.card');
        let postId = cardEL.dataset.post;
        // console.log(cardEL);
        api.deletePost(postId).then(res => {
            cardEL.parentNode.parentNode.removeChild(cardEL.parentNode);
        });

    } else if (elm.matches('#add-btn') || elm.parentNode.matches('#add-btn')) {
        if (uploadForm.style.display==='none') {
            uploadForm.style.display='block';
        } else {
            uploadForm.style.display='none';
        }
    } else if (elm.matches('.edit-btn') || elm.parentNode.matches('.edit-btn')) {
        let cardEL = getClosest(elm, '.card');
        let postId = cardEL.dataset.post;
        let descEl = document.querySelector('#edit-desc');
        let imgEl  = document.querySelector('#preview-edit');
        document.querySelector('#post-id-edit').value=postId;

        api.getPost(postId).then( res => {
            console.log(res);
            descEl.value = res.meta.description_text;
            imgEl.src = 'data:image/png;base64,'+res.thumbnail;
        });
        
        editForm.style.display = 'block';
    } else if (elm.matches('#edit-save-btn')) {
        let hiddenId = document.querySelector('#post-id-edit');
        let descEl   = document.querySelector('#edit-desc');
        let imgEl    = document.querySelector('#preview-edit');

        let post_id = hiddenId.value;
        let desc    = descEl.value;

        api.putPost(post_id,desc).then( res => {
            editForm.style.display = 'none';
            hiddenId.value = '';
            imgEl.src      = '';
            descEl.value   = '';
            myGallery();
        })

    } else {
        console.log(elm);
    }
});

let offsetFeed = 0

function myGallery(){
    
    let postCount = 0;
    galleryEl.innerHTML ='';

    api.posts.sort(function(a,b) {return b-a}).forEach(postId => {
        let card = createElement('div',null,{'data-id':postId, class: 'col-md-3'});
        api.getPost(postId)
        .then(post => {
            card.appendChild(createMyPostTile(
                post.id,
                post.thumbnail,
                post.meta.description_text,
                post.meta.published,
                post.meta.likes.length,
                post.comments.length
            ));
        });
        galleryEl.appendChild(card);
    });
}

function showFeeds(){
    api.getUserFeed(offsetFeed,2).then(feeds => {
        
        // console.log(feeds);
        let parent     = document.getElementById('large-feed');
        let rec        = 0;
        let row        = '';
        let rec_length = feeds.posts.length;
        
        feeds.posts.forEach(post => {
            // console.log(post);
            // if (rec % 3 === 0){
            row = createElement('div', null, { class: 'row photo' });
            // }
            let card = createElement('div', null, { class: 'col-md-12' });
            card.appendChild(createPostTile(post));
            row.appendChild(card);
            // if (rec % 3 === 2 || (rec === rec_length - 1 && rec_length !== 0)){
            parent.appendChild(row);
            // }
            rec += 1;
            offsetFeed+=1;
        });
    })
}


// infinite scroll
var feedElm = document.querySelector('#large-feed');
feedElm.addEventListener('scroll',function() {
    console.log('scorll');
    if (feedElm.scrollTop + feedElm.clientHeight >= feedElm.scrollHeight) {
        showFeeds();
    }
});

function myProfile(){
    let usernameEl  = document.querySelector('#my-profile-username');
    let userIdEl    = document.querySelector('#my-profile-user-id');
    let nameEl      = document.querySelector('#my-profile-name');
    let emailEl     = document.querySelector('#my-profile-email');
    let numPostEl   = document.querySelector('#my-profile-num-posts');
    let followerEl  = document.querySelector('#my-profile-num-follower');
    let followingEl = document.querySelector('#my-profile-num-following');
    api.getUser().then(response => {
        userIdEl.value        = response.id ;
        usernameEl.innerHTML  = response.username ;
        nameEl.innerHTML      = response.name;
        emailEl.innerHTML     = response.email;
        numPostEl.innerHTML   = response.posts.length;
        followerEl.innerHTML  = response.followed_num;
        followingEl.innerHTML = response.following.length;
    });
}

function userProfile(response) {
    profilePage.style.display = "block";
    let usernameEl  = document.querySelector('#profile-username');
    let emailEl     = document.querySelector('#profile-email');
    let numPostEl   = document.querySelector('#profile-num-posts');
    let followerEl  = document.querySelector('#profile-num-follower');
    let followingEl = document.querySelector('#profile-num-following');
    let followBtn   = document.querySelector('.follow-btn');
    let unfollowBtn = document.querySelector('.unfollow-btn');
    
    usernameEl.innerHTML     = response.name + " ("+ response.username+")";
    emailEl.innerHTML        = response.email;
    numPostEl.innerHTML      = response.posts.length;
    followerEl.innerHTML     = response.followed_num;
    followingEl.innerHTML    = response.following.length;
    followBtn.dataset.user   = response.username;
    unfollowBtn.dataset.user = response.username;

    if (api.following.indexOf(response.id) >=0) {
        
        followBtn.style.display   = 'none';
        unfollowBtn.style.display = 'inline';
        
    } else {
        
        followBtn.style.display   = 'inline';
        unfollowBtn.style.display = 'none';

    }
}


// bgfhdj12d10a1 Anon