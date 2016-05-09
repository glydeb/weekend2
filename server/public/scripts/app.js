var nameElement; // variables to hold elements to be created for each person
var linkElement;
var shoutOutElement;
var currentIndex = 0;  //initial starting array element/person
var cancelTimer; // holds ID for slideshow timer function
var delay = 10000; // 10 seconds per slide

$(document).ready(function () {
  $.ajax({
    type: 'GET',
    url: '/data',
    success: function (data) {

      // create page structure
      $('body').append('<div id="container"></div>');
      $('body').append('<footer></footer>');
      $('footer').append('<button class="next">Next</button>');
      $('footer').append('<button class="prev">Previous</button>');
      $('footer').append('<div id="selector-bar"></div>');

      //create divs for each person
      for (var i = 0; i < data.mu.length; i++) {
        $('#container').append('<div class="person' + i + ' hidden">');
        var $el = $('#container').children().last();
        nameElement = '<p>Name: ' + data.mu[i].name + '</p>';
        linkElement = '<p>Github link: <a href = "https://github.com/' +
          data.mu[i].git_username + '">https://github.com/' +
          data.mu[i].git_username + '</a></p>';
        shoutOutElement = '<p>Shoutout: ' + data.mu[i].shoutout + '</p>';
        $el.append(nameElement + linkElement + shoutOutElement);

        //create a graphical representation of the objects in the array
        $('#selector-bar').append('<p class = "box' + i + '">' +
          (i + 1) + '</p>');
      }

      //highlight first box and unhide first person
      $('.box' + currentIndex).toggleClass('highlight');
      $('.person' + currentIndex).toggleClass('hidden');

      //create next & previous button event handlers
      $('body').on('click', 'button.next', buttonNext);

      $('body').on('click', 'button.prev', function () {

        // cancel slideshow timer, clear current person and move pointer
        // to previous person
        clearInterval(cancelTimer);
        toggleID(currentIndex);
        currentIndex--;

        // check for wrap
        if (currentIndex < 0) { currentIndex = data.mu.length - 1; }

        // wait for previous person to fade out, then fade in new person
        // and restart slideshow
        setTimeout(toggleID, 800, currentIndex);
        cancelTimer = setInterval(nextPerson, delay);
      });

      //create selector-bar click event handler
      $('body').on('click', '#selector-bar p', function () {

        // cancel slideshow timer, clear current person and move pointer
        // to clicked person
        clearInterval(cancelTimer);
        toggleID(currentIndex);
        currentIndex = (parseInt($(this).text())) - 1;

        // wait for previous person to fade out, then fade in new person
        // and restart slideshow
        setTimeout(toggleID, 800, currentIndex);
        cancelTimer = setInterval(nextPerson, delay);
      });

      //create a timer that will move to the next person
      cancelTimer = setInterval(nextPerson, delay);

      // hide/reveal person function
      // anchor highlighter/dehighlighter
      function toggleID(id) {
        $('.person' + id).fadeToggle(700);
        $('.box' + id).toggleClass('highlight');
      }

      // function to move to next person when the button is clicked
      // (cancels and restarts the slideshow timer)
      function buttonNext() {
        clearInterval(cancelTimer);
        nextPerson();
        cancelTimer = setInterval(nextPerson, delay);
      }

      // Move to next person - used by both the slideshow & next button
      function nextPerson() {

        // fade out current person and move target to next person
        toggleID(currentIndex);
        currentIndex++;

        // check for wrap
        if (currentIndex >= data.mu.length) { currentIndex = 0; }

        // wait for previous person to fade out, then fade new one in
        setTimeout(toggleID, 800, currentIndex);
      }
    },
  });
});
