let checkMarked = document.getElementsByClassName("fa-check");
let maybe = document.getElementsByClassName("fa-pause");
let trash = document.getElementsByClassName("fa-trash");      
const currentDate = new Date().toISOString().split('T')[0];
document.getElementById('datePicker').min = currentDate;
    

//Take a look at EJS file Count the span's the like count span is included that is what line line/9-->

Array.from(checkMarked).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const date = this.parentNode.parentNode.childNodes[3].innerText
        const liElement = element.closest('li');
      
        fetch('/events', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'name': name,
            'date': date,
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          liElement.classList.remove('yellow-background');
          liElement.classList.add('green-background');
          
        })
      });
});

Array.from(maybe).forEach(function(element) {
  element.addEventListener('click', function(){
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const date = this.parentNode.parentNode.childNodes[3].innerText
    const liElement = element.closest('li');
  
    fetch('/events/maybe', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'name': name,
        'date': date,
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      liElement.classList.add('yellow-background');
      liElement.classList.remove('green-background');

    })
  });
});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const date = this.parentNode.parentNode.childNodes[3].innerText
        fetch('events', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name,
            'date': date
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
