$(document).ready(function () {

    const questionsArray = [
        "Your mind is always buzzing with unexplored ideas and plans",
        "Generally speaking, you rely more on your experience than your imagination",
        "You find it easy to stay relaxed and focused even when there is some pressure",
        "You rarely do something just out of sheer curiosity",
        "People can rarely upset you",
        "It is often difficult for you to relate to other people’s feelings",
        "In a discussion, truth should be more important than people’s sensitivities",
        "You rarely get carried away by fantasies and ideas",
        "You think that everyone’s views should be respected regardless of whether they are supported by facts or not",
        "You feel more energetic after spending time with a group of people"
    ];

    let newMemberId = [];

    let scoresArr = []; //pushing here only scores arrays

    $.get("/api/friends", function (data) {
        newMemberId.push(data.length + 1);
    });

    function displayQuestions(array) {
        array.forEach((element, index) => {
            //creating elements
            let title = $("<h5>");
            let question = $("<p>");
            let selector = $("<select>");
            let firstOption = $("<option>");
            selector.addClass("form-control");
            selector.attr("id", index);
            firstOption.attr("selected", "selected");
            firstOption.text("Select an option");

            selector.prepend(firstOption);
            //display question number
            title.text("Question #" + parseInt(index + 1));
            //display question
            question.text(element);

            //creating option 1-5
            for (let i = 1; i < 6; i++) {

                let option = $("<option>");
                selector.append(option);
                option.val(i);
                option.attr("data-option", i)
                if (option.val() == "1") {
                    option.text(i + " (Stongly disagree)");
                } else if (option.val() == "5") {
                    option.text(i + " (Stongly agree)");
                } else {
                    option.text(i);
                }
            }
            //appending newly created question block
            $(".question").append(title);
            $(".question").append(question);
            $(".question").append(selector);
            $(".question").append("<hr>");
        });

    }

    function compare(user) {
        $.get("/api/friends", function (data) {
            let indexes = [];
            let closest = 0;
            let indexOfClosestResult = 0;
            console.log(data);

            let uScores = []; //all my members scores

            let diffSums = []; //pushing in array the differences

            data.forEach((element, index) => {
                uScores.push(element.scores);
            })
            //here finding the difference
            for (let i = 0; i < uScores.length; i++) {
                let sum = 0; //declare variable sum for use when i need to sum the differences

                // my user is always the last one pushed in array 
                let userScoresIndex = uScores.length - 1;

                const friend = uScores[i]; //single member that is not my user
                const user = uScores[userScoresIndex]; //my user

                console.log("-----------------");

                //conditional so my loop wont consider my user array
                if (i !== userScoresIndex) {
                    //iterating scores array
                    for (let j = 0; j < friend.length; j++) {
                        const el = friend[j]; //getting element of member's scores array
                        const diff = Math.abs(el - user[j]); //getting element at the same index from user scores array
                        //using abs so we don't have negative numbers
                        sum += diff;  //summing differences
                    }
                    diffSums.push(sum); //pushing differences in a new clean array
                    console.log(diffSums);
                    closest = Math.min(...diffSums); //finding the minimal difference
                    indexOfClosestResult = diffSums.indexOf(closest);



                }


            }

            for (let x = 0; x < diffSums.length; x++) {
                console.log("diffSums[x] : " + diffSums[x]);
                console.log("closest : " + closest);

                if (diffSums[x] === closest)
                    indexes.push(x);

            }
            console.log(indexes); //this is the closets match IDs
            console.log(indexOfClosestResult); //this is the closets match ID
            showRes(indexes);
        })
    }

    function showRes(arr) {

        $.get("/api/friends", function (data) {
            data.forEach((element1, index1) => {
                arr.forEach((element2, index2) => {
                    if (index1 === element2) {

                        let memberCardDiv = $("<div>");
                        let memberName = $("<h4>");
                        let memberImage = $("<img>");
                        let memberProfileLink = $("<button>");
                        let hr = $("<hr>");
                        memberCardDiv.addClass("col-auto");
                        memberCardDiv.append(memberName);
                        memberCardDiv.append(memberImage);
                        memberCardDiv.append(memberProfileLink);
                        memberCardDiv.append(hr);
                        memberName.text(element1.name);
                        memberName.attr("class", "text-center");
                        memberImage.attr("src", element1.photo);
                        memberImage.attr("class", "img-fluid text-center");
                        memberImage.attr("style", "max-height: 200px");
                        memberProfileLink.addClass("btn btn-pink btn-block my-2 text-center check-profile");
                        memberProfileLink.attr("id", element1.id);
                        memberProfileLink.text("Check the profile!");
                        $(".modal-body").append(memberCardDiv);

                    }
                })
            });

        });

    }

    $("#submit").on("click", function (event) {
        event.preventDefault();
        $(".modal-body").empty();
        for (let i = 0; i <= 10; i++) {

            if ($("#" + i).val() === "Select an option") {
                console.log($("#" + i).attr("id"));
                $("#" + i).addClass("text-red");
                alert("Please, fill out all the fields before submitting!");
                return false;
            }

        }

        if ($("#name").val() === "" || $("#picture").val() === "") {
            alert("Please, fill out all the fields before submitting!")
            return false;
        }

        //iterating question array
        for (let i = 0; i < questionsArray.length; i++) {
            let selected = $(`#${i} option:selected`).val(); // finding selected answer value
            scoresArr.push(selected); //pushing selected option to scores array
        }

        //creating object to post to my router
        let newUser = {
            id: newMemberId[0],
            name: $("#name").val(),
            photo: $("#picture").val(),
            scores: scoresArr
        } //posting
        console.log(newUser);

        $.post("/api/friends", newUser)
            .then(function (data) {
                console.log(data);
                alert("added!")
            });
        //calling compare answeers function
        compare(newUser);

    })

    $(document).on("click", ".check-profile", function (event) {
        console.log("click");

        event.preventDefault();
        let memberId = $(this).attr("id");
        $.get(`/api/friends/${memberId}`, function (data) {
            console.log(data);
            if (data) {
                window.open(`/api/friends/${memberId}`, '_blank');
            }
            else {
                console.log("nooooo");

            }
        });

    });

    displayQuestions(questionsArray);

});