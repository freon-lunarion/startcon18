// change this when you integrate with the real API, or when u start using the dev server
// const API_URL = 'http://localhost:8080/data'
const API_URL = 'http://127.0.0.1:5000'

const getJSON = (path, options) => 
    fetch(path, options)
        .then(res => res.json())
        .catch(err => console.warn(`API_ERROR: ${err.status}`));

/**
 * This is a sample class API which you may base your code on.
 * You don't have to do this as a class.
 */
export default class API {

    /**
     * Defaults to teh API URL
     * @param {string} url 
     * @param {string} token 
     */
    constructor(url = API_URL,token=null) {
        this.url       = url;
        this.token     = token;
        this.following = null;
        this.posts     = null;
    }

    get token() {
        return this._token;
    }

    set token(value) {
        this._token = value;
    }

    get following() {
        return this._following;
    }

    set following(value) {
        this._following = value;
    }

    get posts() {
        return this._posts;
    }

    set posts(value) {
        this._posts = value;
    }

    makeAPIRequest(method='GET',path,payload=null) {
        const otherParam = {
            headers: {
                'content-type': 'application/json',
                'accept'      : 'application/json'
            },
            method: method
        };

        if (payload !== null && payload !== undefined ) {
            otherParam['body'] = JSON.stringify(payload)
        }
        
        let regex = /^auth/
        if (! regex.test(path) ){
            let token = this.token;

            otherParam['headers']['Authorization'] = 'Token '+ token
            // console.log('API token',this.token)

        }
        // console.log(otherParam);
        return getJSON(`${this.url}/${path}`,otherParam);
    }
    

    authLogin(username, password){
        const path ='auth/login';
        const data = {
            "username": username,
            "password": password
        };

        // let responses = this.makeAPIRequest('POST',path,data);        
        // return responses;
        return this.makeAPIRequest('POST',path,data).then(res => {
            this.token = res.token;
            this.getUser().then(res => {
                this.following = res.following
                // console.log('follow',this.following);

                this.posts = res.posts.sort(function(a,b) {return b-a});
                // console.log('posts', this.posts);
            });
        })
    }

    authSignup(username,password,email,name) {
        const path ='auth/signup';
        const data = {
            "username": username,
            "password": password,
            "email"   : email,
            "name"    : name,
        };

        return this.makeAPIRequest('POST',path,data).then(res => {
            this.token = res.token;
            this.getUser().then(res => {
                console.log(res.following);
                this.following = res.following
                this.posts = res.posts.sort(function(a,b) {return b-a});
                
            });
        })

    }


    getUser(id=null,username=null){
        let path ='user/';
        // console.log(username);

        if (username !== null && id===null) {
            path  = path +'?username='+username;
        } else if (username === null && id!==null) {
            path  = path +'?id='+id;

        } else if (username !== null && id!==null) {
            path  = path +'?username='+username+'&id='+id;
        }

        return this.makeAPIRequest('GET',path);
    }

    putUser(payload) {
        const path='user/'

        return this.makeAPIRequest('PUT',path,payload);
    }

    getUserFeed(p=0,n=10){
        const path='user/feed?p='+p+'&n='+n;
        // console.log(path);
        
        return this.makeAPIRequest('GET',path);
    }

    putUserFollow(username){
        const path='user/follow/?username='+username;
        return this.makeAPIRequest('PUT',path);
    }

    putUserUnfollow(username){
        const path='user/unfollow/?username='+username;
        return this.makeAPIRequest('PUT',path);
    }

    postPost(description,src) {
        const path ='post/';
        const payload = {
            'description_text': description,
            'src'             : src
        };

        return this.makeAPIRequest('POST',path,payload);

    }

    getPost(id){
        const path='post/?id='+id;
        return this.makeAPIRequest('GET',path);
    }

    putPost(id,description){
        const path='post/?id='+id;
        const payload = {
            'description_text': description,
        };
        return this.makeAPIRequest('PUT',path,payload);
    }

    deletePost(id){
        const path='post/?id='+id;
        return this.makeAPIRequest('DELETE',path);
    }

    putPostComment(id, author, published, comment){
        const path='post/comment?id='+id;
        const payload = {
            'author'   : author,
            'published': published,
            'comment'  : comment
        };
        return this.makeAPIRequest('PUT',path,payload);
    }

    putPostLike(id){
        const path='post/like?id='+id;
        
        return this.makeAPIRequest('PUT',path);
    }

    putPostUnlike(id){
        const path='post/unlike?id='+id;
        
        return this.makeAPIRequest('PUT',path);
    }

}
