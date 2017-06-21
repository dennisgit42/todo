

$(function(){
  
  Paloma.start();



  // The taskHTML method takes in a javascript representation 
  // of the task and produces an HTML representation using 
  // <li> tags
  function taskHtml(task) {
    var checkedStatus = task.done? "checked" : "" ;
    var liString = '<li><div class="view"><input class="toggle" type="checkbox"' +
      " data-id='" + task.id + "'" +
      checkedStatus + 
      '><label>' +
      task.title +
      '<button class="destroy"></button>' +  
      '</label></div></li>';
    return liString;
  }



  // toggleTask takes a HTML representation of the event that fires from an HTML
  // representation of the toggle checkbox and performs an API request to toggle
  // the value of the 'done' field
  function toggleTask(e){
    var itemId = $(e.target).data('id');

    var doneValue = Boolean( $(e.target).is(':checked') );

    $.post("/tasks/" + itemId, {
      _method: "PUT",
      task: {
        done: doneValue
      }
    });
  }


  $.get("/tasks").success( function(data){
      var htmlString = "";
      
      $.each(data, function(index, task){
        htmlString += taskHtml(task);
      });
      $('.todo-list').html(htmlString);

      $('.toggle').click(toggleTask);
  });

  $('#new-form').submit(function(event){
    event.preventDefault();
    var textBox = $('.new-todo');
    var payload = {
      task: {
        title: textBox.val()
      }
    };
    $.post("/tasks", payload).success(function(data){
      var htmlString = taskHtml(data);
      var ulTodo = $('.todo-list');
      ulTodo.append(htmlString);
      $('.toggle').click(toggleTask);
      $('.new-todo').val("");
    })
  }); 

  $('.destroy').click(function(e){
    var itemId = $(e.target).data('id');
    $.post("/tasks/" + itemId, function(data, status){
      console.log('data: ' + data + 'status: ' + status);
    })
  })

});
