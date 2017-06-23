

$( document ).ready(function(){
  
  Paloma.start();



  // The taskHTML method takes in a javascript representation 
  // of the task and produces an HTML representation using 
  // <li> tags
  function taskHtml(task) {
    var checkedStatus = task.done? "checked" : "" ;
    var liClass = task.done? "completed" : "";
    var liElement = '<li id="listItem-' + task.id + '" class="' + liClass + '">' + 
      '<div class="view"><input class="toggle" type="checkbox"' +
      " data-id='" + task.id + "'" +
      checkedStatus + 
      '><label>' +
      task.title +
      '<button class="destroy"></button>' +  
      '</label></div></li>';
    return liElement;
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
    }).success(function(data){
      var liHtml = taskHtml(data)
      var $li = $("#listItem-" + data.id);
      $li.replaceWith(liHtml);
      $('.toggle').change(toggleTask);
    });

  }

  console.log("Going to add handler to " + $(".destroy").length + " items.");
  $.get("/tasks").success( function(data){
      var htmlString = "";
      
      $.each(data, function(index, task){
        htmlString += taskHtml(task);
      });
      $('.todo-list').html(htmlString);

      $('.toggle').change(toggleTask);
      console.log("Going to add handler to " + $(".destroy").length + " items.");
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
      $('.toggle').change(toggleTask);
      $('.new-todo').val("");
    });
  }); 

  console.log("Going to add handler to " + $(".destroy").length + " items.");
  $('.destroy').click(function(e){ 
    alert("Have reached first line of click function!");  
    var itemId = $(e.target).data('id');
    $.get("/tasks").success(function(data){
      _method: "DELETE"
    })
    console.log("deleted the task: " + itemId);
    alert("Have reached last line of click function!");  
  });
  console.log("Going to add handler to " + $(".destroy").length + " items.");

});


