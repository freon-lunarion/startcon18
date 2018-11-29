/* returns an empty array of size max */
export const range = (max) => Array(max).fill(null);

/* returns a randomInteger */
export const randomInteger = (max = 1) => Math.floor(Math.random()*max);

/* returns a randomHexString */
const randomHex = () => randomInteger(256).toString(16);

/* returns a randomColor */
export const randomColor = () => '#'+range(3).map(randomHex).join('');

/**
 * You don't have to use this but it may or may not simplify element creation
 * 
 * @param {string}  tag     The HTML element desired
 * @param {any}     data    Any textContent, data associated with the element
 * @param {object}  options Any further HTML attributes specified
 */
export function createElement(tag, data, options = {}) {
    const el = document.createElement(tag);
    el.textContent = data;
   
    // Sets the attributes in the options object to the element
    return Object.entries(options).reduce(
        (element, [field, value]) => {
            element.setAttribute(field, value);
            return element;
        }, el);
}

export function createUserElm(name ){
    let link = createElement('button',name,{type:"button",title:" see profile",class:"btn-outline-primary btn btn-lg user-btn" ,'data-username':name});

    return link;

}

export function createLikeGroupBtn(postId, num ){
    let str      = num;
    let output   = createElement('div',null, {class:"btn btn-group btn-group-lg"});
    let modalBtn = createElement('button', str, {type:"button",'data-post-id':postId , class: 'btn likes-btn' })
    let sendBtn  = createElement('button', null, {type:"button",title:"give a like",'data-post-id':postId , class: 'btn send-likes-btn btn-light' })
    sendBtn.appendChild(createElement('i',null, {class: 'far fa-thumbs-up'}));
    
    output.appendChild(modalBtn);
    output.appendChild(sendBtn);

    return output;

}

export function createCommentsGroupBtn(postId, num ){
    let str      = num;
    let output   = createElement('div',null, {class:"btn btn-group btn-group-lg"});
    let modalBtn = createElement('button', str, {type:"button",'data-post-id':postId , class: 'btn comments-btn' })
    let sendBtn  = createElement('button', null, {type:"button", title:"give a comment", 'data-post-id':postId , class: ' btn send-comments-btn btn-light' })
    sendBtn.appendChild(createElement('i',null, {class: 'far fa-comment-dots', 'data-post-id':postId}));
    
    output.appendChild(modalBtn);
    output.appendChild(sendBtn);

    return output;

}

function createActBtn(postId) {
    let output = createElement('div',null, {class:"btn btn-group btn-group-lg"});
    let edit   = createElement('button', null, {type:"button",'data-post-id':postId, title:'Edit', class: 'btn edit-btn btn-outline-secondary' })
    edit.appendChild(createElement('i',null, {class: 'fas fa-pen', 'data-post-id':postId}))
    let remove = createElement('button', null, {type:"button",'data-post-id':postId, title:'Remove', class: 'btn remove-btn btn-outline-danger' })
    remove.appendChild(createElement('i',null, {class: 'fas fa-trash', 'data-post-id':postId}))

    output.appendChild(edit);
    output.appendChild(remove);
    return output;

}   

/**
 * Given a post, return a tile with the relevant data
 * @param   {object}        post 
 * @returns {HTMLElement}
 */
export function createPostTile(post) {
    const section = createElement('div', null, { class: 'card mb-4 shadow-sm' });

    section.appendChild(createElement('img', null, 
        { src: 'data:image/png;base64,'+post.thumbnail, alt: post.meta.description_text, class: 'card-img-top' }));


    const body = createElement('div', null, { class: 'card-body' });
    const title = createElement('h5', null, { class: 'card-title' });
    title.appendChild(createUserElm(post.meta.author ));
    body.appendChild(title);
    
    body.appendChild(createElement('p', post.meta.description_text, { class: 'card-text' }));

    const meta = createElement('div', null, { class: 'd-flex justify-content-between align-items-center' });
    let likes = createLikeGroupBtn(post.id,post.meta.likes.length);
    meta.appendChild(likes);
    let comments = createCommentsGroupBtn(post.id,post.comments.length);
    meta.appendChild(comments);

    body.appendChild(meta);

    body.appendChild(createElement('small', dateFormater(post.meta.published), { class: 'text-muted' }))
    section.appendChild(body);
    
    return section;
}

export function createMyPostTile(id, img, desc,timestamp, numLikes, numComments) {
    // const outer = createElement('div', null, {  class: 'col-md-3' });
    const section = createElement('div', null, { 'data-post': id,class: 'card mb-4 shadow-sm' });

    section.appendChild(createElement('img', null, 
        { src: 'data:image/png;base64,'+img, alt: desc, class: 'card-img-top' }));


    const body = createElement('div', null, { class: 'card-body' });
    
    body.appendChild(createElement('p', desc, { class: 'card-text' }));

    // const meta = createElement('div', null, { class: 'd-flex justify-content-between align-items-center' });
    let likes = createLikeGroupBtn(id,numLikes);
    body.appendChild(likes);
    let comments = createCommentsGroupBtn(id,numComments);
    body.appendChild(comments);

    // body.appendChild(meta);
    body.appendChild(createActBtn(id));
    body.appendChild(createElement('br',null,{}));
    body.appendChild(createElement('small', dateFormater(timestamp), { class: 'text-muted' }))
    section.appendChild(body);
    // outer.appendChild(section);
    return section;
}

// Given an input element of type=file, grab the data uploaded for use
export function uploadImage(fl) {
    const [ file ] = event.target.files;
    // console.log(file);

    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);

    // bad data, let's walk away
    if (!valid)
        return false;
    
    // if we get here we have a valid image
    const reader = new FileReader();
    
    reader.onload = (e) => {
        // do something with the data result
        const dataURL = e.target.result;
 
        document.getElementById('image-b64').value = dataURL;
    };

    // this returns a base64 image
    reader.readAsDataURL(file);
  
}

/* 
    Reminder about localStorage
    window.localStorage.setItem('AUTH_KEY', someKey);
    window.localStorage.getItem('AUTH_KEY');
    localStorage.clear()
*/
export function checkStore(key) {
    if (window.localStorage)
        return window.localStorage.getItem(key)
    else
        return null

}

export function getClosest(elem, selector) {

	// Element.matches() polyfill
	if (!Element.prototype.matches) {
	    Element.prototype.matches =
	        Element.prototype.matchesSelector ||
	        Element.prototype.mozMatchesSelector ||
	        Element.prototype.msMatchesSelector ||
	        Element.prototype.oMatchesSelector ||
	        Element.prototype.webkitMatchesSelector ||
	        function(s) {
	            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
	                i = matches.length;
	            while (--i >= 0 && matches.item(i) !== this) {}
	            return i > -1;
	        };
	}

	// Get the closest matching element
	for ( ; elem && elem !== document; elem = elem.parentNode ) {
		if ( elem.matches( selector ) ) return elem;
	}
	return null;

};

export function dateFormater(unixEpochTime) {
    let dt = new Date(unixEpochTime*1000);
    // console.log(unixEpochTime, dt, dt.setUTCSeconds(unixEpochTime));
    return dt.toDateString();
}

export function toggleHideShow(elm) {
    if (elm.style.display === 'none'){
        elm.style.display ='block';
    } else {
        elm.style.display ='none';
    }
}