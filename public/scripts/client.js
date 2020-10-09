/*
* Client-side JS logic goes here
* jQuery is already loaded
* Reminder: Use (and do all your DOM work in) jQuery's document ready function
*/
// when the document is ready load the file
$(document).ready(() => {
  // escape function for xss security
  const escape =  function(str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  //creating tweet element
  const createTweetElement = function(tweetObj) {
    const userInfo = tweetObj.user;
    const content = tweetObj.content.text;
    const tweetBody = `<article class="tweet">
            <header>
            <div class="profileAndName">
              <img src=${userInfo.avatars}>
              <Span>${userInfo.name}</span>
            </div>
            <span id="username">${userInfo.handle}</span>
          </header>
          <p>
            ${escape(content)}
          </p>
          <footer>
            <span>${tweetObj.created_at}</span>
          </footer>
        </article>`;
    return tweetBody;
  };
  //rendering the tweet element with the data form the server
  const renderTweets = function(tweets) {
    for (let tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      $("#tweetContainer").prepend($tweet);
    }
    return;
  };


  const $postTweet = $("#tweetForm");
  // submit listener
  $postTweet.on("submit", function(event) {
    // prevent default behavior
    event.preventDefault();
    // toggle the error message
    $(".errorMessage").slideUp();
    // serialiaze the text data
    const serializedData = $(this).serialize();
    // form validation logic
    console.log($("#tweet-text").val().length)
    if ($("#tweet-text").val().length > 140) {
      // toggle the error message
      $("#tooLongMessage").slideDown();
    } else if ($("#tweet-text").val().length <= 0) {
      // toggle the error message
      $("#noTweetMessage").slideDown();
    } else {
      // ajax post request
      $.post("/tweets", serializedData)
        .then(() => loadtweets());
      $("#tweet-text").val("");
      $(".counter").val(140);
    }
  });


  // toggle writing new tweet

  $("#ToggleButton").on("click", function() {
    $(".new-tweet").slideToggle();
    $("#tweet-text").select();
    $("#tweet-text").val("");
    $(".counter").val(140);
  });
  
  // load tweet function
  const loadtweets = function() {
    // ajax GET request
    $.get("/tweets", function(data) {
      renderTweets(data);
    });
  };
  //load the tweets for the first time
  loadtweets();
  
});