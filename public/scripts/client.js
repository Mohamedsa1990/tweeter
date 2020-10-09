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
    const timeStamp = tweetObj.created_at;
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
            <span>${time2TimeAgo(timeStamp)}</span>
            <div class="userAction">
              <img src="/images/like.png" width="20px" height="20px">
              <img src="/images/retweet.png" width="20px" height="20px">
              <img src="/images/flag.png" width="20px" height="20px">
            </div>
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
  // load tweet function
  const loadtweets = function() {
    $("#tweetContainer").empty();
    // ajax GET request
    $.get("/tweets", function(data) {
      renderTweets(data);
    });
  };
  //load the tweets for the first time
  loadtweets();

  // time stamp to time age function

  function time2TimeAgo(ts) {
    const tsInSecond = Math.floor(ts / 1000);
    const d = new Date();
    const nowTs = Math.floor(d.getTime() / 1000);
    const seconds = nowTs - tsInSecond;
    if (seconds > (365 * 24 * 3600)) {
      return `${Math.floor(seconds / (365 * 24 * 3600))} years ago`;
    } else if (seconds > (2 * 24 * 3600)) {
      return `${Math.floor(seconds / (24 * 3600))} days ago`;
    } else if (seconds > (24 * 3600)) {
      return "yesterday";
    } else if (seconds > 3600) {
      return `${Math.floor(seconds / 3600)} hours ago`;
    } else if (seconds > 60) {
      return `${Math.floor(seconds / 60)} minutes ago`;
    } else if (seconds < 60) {
      return "just now";
    }
  }


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
    $(".errorMessage").slideUp();
    $("#tweet-text").select();
    $("#tweet-text").val("");
    $(".counter").val(140);
  });
  
  
});