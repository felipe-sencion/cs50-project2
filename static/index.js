document.addEventListener('DOMContentLoaded', () =>
  {
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () =>
      {
        document.querySelector('#add-channel').onclick = () =>
        {
          const channel_name = document.querySelector('#channel').value;
          socket.emit('create channel', {'channel': channel_name});
          document.querySelector('#channel').value = '';
          document.querySelector('#add-channel').disabled = true;
        };

        document.querySelector('#post-message').onclick = () =>
        {
          const message = document.querySelector('#message-input').value;
          const channel = localStorage.getItem('channel');
          const datetime = new Date();

          socket.emit('post message', {'channel': `${channel}`,
          'message': `${message}`, 'user': `${localStorage.getItem('userName')}`,
          'datetime': `${datetime.getDate()}/${datetime.getMonth()+1}/${datetime.getFullYear()} - ${datetime.getHours()}:${datetime.getMinutes()}:${datetime.getSeconds()}`});
          document.querySelector('#message-input').value = '';
          document.querySelector('#post-message').disabled = true;
        };
      }
    );

    socket.on('new channel', data =>
    {
      const a = document.createElement('a')
      a.className = "nav-link";
      a.setAttribute("data-page", `${data.channel_name}`);
      a.setAttribute("data-toggle", 'pill');
      a.setAttribute("role", "tab");
      a.setAttribute("aria-controls", `v-pills-${data.channel_name}`);
      a.setAttribute("aria-selected", "true");
      a.setAttribute("id",`v-pills-${data.channel_name}-tab`);
      a.innerHTML = `${data.channel_name}`;
      a.href = '';
      if (document.querySelector("#v-pills-tab").childElementCount > 1)
      {
        var current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
      }
      a.className += ' active';
      document.querySelector("#v-pills-tab").appendChild(a);

      a.onclick = () =>
      {
        const m = document.querySelector('#v-pills-tabContent');
        m.innerHTML = "";
        var current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        a.className += ' active';
        a.style.animationIterationCount = 1;

        load_page(a.dataset.page);
        return false;
      }

      if(localStorage.getItem('userName'))
      {
        show_widgets();
      }
    }
    );

    function load_page(name)
    {
      const request = new XMLHttpRequest();
      request.open('GET', `/${name}`);

      request.onload = () =>
      {
        const response = JSON.parse(request.responseText);
        if (response.success)
        {
          localStorage.setItem('channel', `${name}`);
          document.title = `Flack::${name}`;
          for (var i = 0; i < response.messages.length; i++)
          {
            const post = document.createElement('div');
            post.className = 'tab-pane fade show active';
            post.setAttribute('role', 'tabpanel');
            post.setAttribute('aria-labelledby', `v-pills-${localStorage.getItem('channel')}-tab`);
            post.innerHTML = `${response.messages[i][1]} - ${response.messages[i][0]} <br> ${response.messages[i][2]}`;
            if (response.messages[i][0] == localStorage.getItem('userName'))
            {
              post.style.textAlign = 'right';
            }
            document.querySelector('.tab-content').append(post);
          }
        }
        else
        {
          document.title = 'Error';
        }
      };
      request.send();
    }
    socket.on('already created', data =>
    {
      alert(`${data.message}`);
    }
    );

    socket.on('new message', data =>
    {
      const post = document.createElement('div');
      post.className = 'tab-pane fade show active';
      post.setAttribute('role', 'tabpanel');
      post.setAttribute('aria-labelledby', `"v-pills-${localStorage.getItem('channel')}-tab"`);
      post.innerHTML = `${data.datetime} - ${data.user} <br> ${data.message}`;
      if (data.user == localStorage.getItem('userName'))
      {
        post.style.textAlign = 'right';
      }
      if (document.querySelector('#v-pills-tabContent').childElementCount >= 100)
      {
        document.querySelector('#v-pills-tabContent').firstChild.remove();
      }
      if (data.channel != localStorage.getItem('channel'))
      {
        document.querySelector(`#v-pills-${data.channel}-tab`).style.animationIterationCount = 'infinite';
        document.querySelector(`#v-pills-${data.channel}-tab`).style.animationPlayState = 'running';
      }
      else
      {
        document.querySelector('.tab-content').append(post);
      }
    }
    );
    document.querySelectorAll('.nav-link').forEach(link =>
    {
      link.onclick = () =>
      {
        const m = document.querySelector('#v-pills-tabContent');
        m.innerHTML = "";
        var current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        link.className += ' active';
        link.style.animationIterationCount = 1;
        load_page(link.dataset.page);
        return false;
      };
    }
    );

    function show_widgets()
    {
      document.getElementById('name').style.display = 'none';
      document.getElementById('btn').style.display = 'none';
      document.getElementById('message-input').style.display = 'block';
      document.getElementById('post-message').style.display = 'block';
      document.getElementById('channel').style.display = 'block';
      document.getElementById('add-channel').style.display = 'block';
      document.getElementById('v-pills-tab').style.display = 'block';
      document.getElementById('v-pills-tabContent').style.display = 'block';
    }

    if(!localStorage.getItem('userName'))
    {
      localStorage.setItem('userName', '');
      document.getElementById('message-input').style.display = 'none';
      document.getElementById('post-message').style.display = 'none';
      document.getElementById('channel').style.display = 'none';
      document.getElementById('add-channel').style.display = 'none';
      document.getElementById('v-pills-tab').style.display = 'none';
      document.getElementById('v-pills-tabContent').style.display = 'none';
    }
    else
    {
      show_widgets();
      document.querySelector('#user-tag').innerHTML = `Hi ${localStorage.getItem('userName')}`;
    }
    if (!localStorage.getItem('channel'))
    {
      localStorage.setItem('channel', '');
      document.getElementById('v-pills-tab').style.display = 'none';
      document.getElementById('v-pills-tabContent').style.display = 'none';
      document.getElementById('message-input').style.display = 'none';
      document.getElementById('post-message').style.display = 'none';
    }
    else
    {
      if(localStorage.getItem('userName'))
      {
        show_widgets();
        load_page(localStorage.getItem('channel'));
      }
    }
    document.querySelector('#btn').onclick = () =>
    {
      const userName = document.querySelector('#name').value;
      localStorage.setItem('userName', userName);
      document.querySelector('#user-tag').innerHTML = `Hi ${userName}`;

      show_widgets();
      document.querySelector('#name').value = '';
      document.querySelector('#btn').disabled = true;
    }

    document.querySelector('#name').onkeyup = () =>
    {
      if (document.querySelector('#name').value.length > 0)
      {
        document.querySelector('#btn').disabled = false;
      }
      else
      {
        document.querySelector('#btn').disabled = true;
      }
    };
    document.querySelector('#channel').onkeyup = () =>
    {
      if (document.querySelector('#channel').value.length > 0)
      {
        document.querySelector('#add-channel').disabled = false;
      }
      else
      {
        document.querySelector('#add-channel').disabled = true;
      }
    };
    document.querySelector('#message-input').onkeyup = () =>
    {
      if (document.querySelector('#message-input').value.length > 0)
      {
        document.querySelector('#post-message').disabled = false;
      }
      else
      {
        document.querySelector('#post-message').disabled = true;
      }
    };
  }
);
