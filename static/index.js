document.addEventListener('DOMContentLoaded', () =>
  {
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () =>
      {
        document.querySelector('#add-channel').onclick = () =>
        {
          //console.log('clicked... waiting for emition');
          console.log('OOOOOOOOOOOOKKKKKKKKKKKKKKk');
          const channel_name = document.querySelector('#channel').value;
          socket.emit('create channel', {'channel': channel_name});
        };

        document.querySelector('#post-message').onclick = () =>
        {
          console.log('post a message');
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
        const response = request.responseText;
        document.querySelector('#messages').innerHTML = response;
        localStorage.setItem('channel', `${name}`);

        //HTML5 states
        //history.pushState({'title': `Flack::${name}`, 'text': response}, name, name);
      };
      request.send();
      //alert(`Load: ${name}`);
    }

    /*window.onpopstate = e =>
    {
      const data = e.state;
      document.title = data.title;
      document.querySelector('#messages').innerHTML = data.text;
    };*/

    socket.on('already created', data =>
    {
      alert(`${data.message}`);
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
