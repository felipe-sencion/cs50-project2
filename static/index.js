document.addEventListener('DOMContentLoaded', () =>
  {
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () =>
      {
        document.querySelector('#add-channel').onclick = () =>
        {
          console.log('clicked... waiting for emition');
          const channel_name = document.querySelector('#channel').value;
          socket.emit('create channel', {'channel': channel_name});
        };

        document.querySelector('#post-message').onclick = () =>
        {
          console.log('post a message');
          const message = document.querySelector('#message-input').value;
          const channel = localStorage.getItem('channel');
          const datetime = new Date();

          socket.emit('post message', {'channel': `${channel}`,
          'message': `${message}`, 'user': `${localStorage.getItem('userName')}`,
          'datetime': `${datetime.getDate()}/${datetime.getMonth()+1}/${datetime.getFullYear()}`});
          console.log('emited');
        };
      }
    );

    socket.on('new channel', data =>
    {
      const li = document.createElement('li');
      //li.innerHTML = `Channel created: ${data.channel_name}`;
      const a = document.createElement('a')
      a.class = 'channel-link';
      a.setAttribute('data-page', `${data.channel_name}`);
      a.innerHTML = `${data.channel_name}`;
      a.href = '';
      li.appendChild(a);
      document.querySelector('#channels').append(li);
      a.onclick = () =>
      {
        load_page(a.dataset.page);
        return false;
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
          document.querySelector('#messages').innerHTML = response.name;
          localStorage.setItem('channel', `${name}`);
          document.title = `Flack::${name}`;
          console.log(`mensaje: ${response.messages[0][0]}  Un total de ${response.messages.length} mensajes`);
          for (var i = 0; i < response.messages.length; i++)
          {
            alert(`${response.messages[i]}`);
            const post = document.createElement('div');
            post.className = 'post';
            post.innerHTML = `${response.messages[i][1]} - ${response.messages[i][0]} <br> ${response.messages[i][2]}`;
            document.querySelector('#posts').append(post);
          }

          //HTML5 states
          history.pushState({'title': `Flack::${name}`, 'text': response.name}, name, name);
        }
        else
        {
          document.querySelector('#messages').innerHTML = 'There was an error';
          document.title = 'Error';
        }
      };
      request.send();
      //alert(`Load: ${name}`);
    }

    window.onpopstate = e =>
    {
      const data = e.state;
      document.title = data.title;
      document.querySelector('#messages').innerHTML = data.text;
    };

    socket.on('already created', data =>
    {
      alert(`${data.message}`);
    }
    );

    socket.on('new message', data =>
    {
      const post = document.createElement('div');
      post.className = 'post';
      post.innerHTML = `${data.datetime} - ${data.user} <br> ${data.message}`;
      document.querySelector('#posts').append(post);
    }
    );
    //Add event to prevoiusly stored channels
    document.querySelectorAll('.channel-link').forEach(link =>
    {
      link.onclick = () =>
      {
          load_page(link.dataset.page);
          return false;
      };
    }
    );

    if(!localStorage.getItem('userName'))
    {
      localStorage.setItem('userName', '')
      alert('No hay')
    }
    else
    {
      alert(`Sí hay ${localStorage.getItem('userName')}`)
      document.querySelector('#user-tag').innerHTML = `Hola ${localStorage.getItem('userName')}`;
    }
    if (!localStorage.getItem('channel'))
    {
      localStorage.setItem('channel', '')
    }
    else
    {
      load_page(localStorage.getItem('channel'));
    }
    document.querySelector('#btn').onclick = () =>
    {
      const userName = document.querySelector('#name').value;
      localStorage.setItem('userName', userName);
      document.querySelector('#user-tag').innerHTML = `Hola ${userName}`;
    }
  }
);
