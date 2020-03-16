document.addEventListener("DOMContentLoaded", () => {
    const DOGSURL = "http://localhost:3000/dogs"
    const main = document.querySelector("main");
    console.log(main)


    fetch(DOGSURL)
    .then(res => res.json())
    .then(data => addDogs(data));
 
    function addDogs(dogArray) {
        dogArray.forEach(appendDog);
    }

    function appendDog(dog) {
        const div = makeDogCard(dog);
        main.appendChild(div);
    }

        
    function makeDogCard(dog) {
        const div = document.createElement("div");
        div.id = dog.id;

        const h2 = document.createElement("h2");
        h2.innerText = dog.name;

        const img = document.createElement("img");
        img.src = dog.image;

        const likes = document.createElement("p");
        likes.innerText = `Likes: ${dog.likes}`;

        const likeButton = document.createElement("button");
        likeButton.innerText = "Like";

        const superLike = document.createElement("button");
        superLike.innerText = "Super Like!";

        const commentHeader = document.createElement("p");
        commentHeader.innerText = "Comments:";

        const commentList = document.createElement("ul");
        dog.comments.forEach(addComment);

        function addComment(comment) {
            const li = document.createElement("li");
            li.innerText = comment;
            commentList.appendChild(li);
        }

        const form = document.createElement("form");
        const label = document.createElement("label");
        label.innerText = "Add Comment:";
        form.appendChild(label);
        const commentInput = document.createElement("input");
        commentInput.type = 'text';
        commentInput.name = 'comment';
        commentInput.placeholder = 'text here';
        form.appendChild(commentInput);
        const submit = document.createElement("input");
        submit.type = 'submit';
        form.appendChild(submit);

        div.appendChild(h2);
        div.appendChild(h2);
        div.appendChild(img);
        div.appendChild(likes);
        div.appendChild(likeButton);
        div.appendChild(superLike);
        div.appendChild(commentHeader);
        div.appendChild(commentList);
        div.appendChild(form);

        likeButton.addEventListener("click", function() {
            dog.likes += 1;
            likes.innerText = `Likes: ${dog.likes}`;
            fetch(`${DOGSURL}/${dog.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({likes: dog.likes})
            }); 
        });

        superLike.addEventListener("click", function() {
            dog.likes += 10;
            fetch(`${DOGSURL}/${dog.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({likes: dog.likes})
            })
            .then(resp => resp.json())
            .then(function(data) {
                likes.innerText = `Likes: ${data.likes}`;
            }); 
        });

        form.addEventListener("submit", function(event) {
            event.preventDefault();
            const newComment = event.target.comment.value;
            dog.comments.push(newComment);
            fetch(`${DOGSURL}/${dog.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({comments: dog.comments})
            })
            .then(resp => resp.json())
            .then(function(data) {
                addComment(data.comments[data.comments.length - 1]);
                commentInput.value = "";
            })
        })
        return div;
    };

    const newDogForm = document.getElementById("new-dog");
    newDogForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const name = event.target.name.value;
        const breed = event.target.breed.value;
        const image = event.target.img.value;
        const dogObj = {
            name,
            breed,
            image,
            likes: 0,
            comments: []
        };
        fetch(DOGSURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(dogObj)
        })
        .then(resp => resp.json())
        .then(function(data) {
            appendDog(data);
            newDogForm.name.value = "";
            newDogForm.breed.value = "";
            newDogForm.img.value = "";
        })

    })
}) 