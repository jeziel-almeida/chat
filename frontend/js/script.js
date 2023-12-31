//login elements
const login = document.querySelector('.login');
const loginForm = login.querySelector('.login__form');
const loginInput = login.querySelector('.login__input');

//chat elements
const chat = document.querySelector('.chat');
const chatForm = chat.querySelector('.chat__form');
const chatInput = chat.querySelector('.chat__input');
const chatButton = chat.querySelector('.chat__button');
const chatMessages = chat.querySelector('.chat__messages');

//wallpaper elements
const wallpapers = document.querySelector('.wallpapers');
const body = document.querySelector('body');

const colors = [
    'AliceBlue', 'AntiqueWhite', 'Aqua', 'Aquamarine', 'Azure', 'Beige', 'Bisque',
    'BlanchedAlmond', 'Blue', 'BlueViolet', 'Brown', 'BurlyWood', 'CadetBlue',
    'Chartreuse', 'Coral', 'CornflowerBlue', 'Cornsilk', 'Cyan', 'DarkCyan', 'DarkTurquoise',
    'DodgerBlue', 'FireBrick', 'FloralWhite', 'Gainsboro', 'GhostWhite', 'Gold', 'GoldenRod',
    'Green', 'GreenYellow', 'HoneyDew', 'HotPink', 'IndianRed', 'Indigo', 'Ivory', 'Khaki',
    'Lavender', 'LavenderBlush', 'LawnGreen', 'LemonChiffon', 'LightBlue', 'LightCoral',
    'LightCyan', 'LightGoldenRodYellow', 'LightGray', 'LightGreen', 'LightPink', 'LightSalmon',
    'LightSeaGreen', 'LightSkyBlue', 'LightSlateGray', 'LightSteelBlue', 'LightYellow',
    'Lime', 'LimeGreen', 'Linen', 'Magenta', 'MediumAquaMarine', 'MediumOrchid',
    'MediumPurple', 'MediumSeaGreen', 'MediumSpringGreen', 'MediumTurquoise', 'MediumVioletRed',
    'MintCream', 'MistyRose', 'Moccasin', 'NavajoWhite', 'OldLace', 'OliveDrab', 'Orange',
    'OrangeRed', 'Orchid', 'PaleGoldenRod', 'PaleGreen', 'PaleTurquoise', 'PaleVioletRed',
    'PapayaWhip', 'PeachPuff', 'Peru', 'Pink', 'Plum', 'PowderBlue', 'RosyBrown', 'RoyalBlue',
    'SaddleBrown', 'Salmon', 'SandyBrown', 'SeaGreen', 'SeaShell', 'SkyBlue', 'SlateBlue',
    'SlateGray', 'Snow', 'SpringGreen', 'SteelBlue', 'Tan', 'Thistle', 'Tomato', 'Turquoise',
    'Violet', 'Wheat', 'White', 'WhiteSmoke', 'Yellow', 'YellowGreen'
];

const user = { id: '', name: '', color: '' }

let websocket;

const createMessageSelfElement = (content) => {

    const div = document.createElement('div');
    div.classList.add('message--self');
    div.innerHTML = content;

    return div;
}

const createMessageOtherElement = (name, color, content) => {

    const div = document.createElement('div');
    const span = document.createElement('span');
    
    div.classList.add('message--other');
    span.classList.add('message--sender');
    
    div.appendChild(span);

    span.innerHTML = name;
    span.style.color = color;
    div.innerHTML += content;

    return div;

}

const createUserJoinedElement = (name) => {

    const p = document.createElement('p');
    const span = document.createElement('span');

    span.innerHTML = name;
    p.appendChild(span);
    p.innerHTML += ' entrou na conversa'

    p.classList.add('user--joined');

    return p;
}

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    })
}

const processMessage = ({ data }) => {

    const { userSender, content } = JSON.parse(data);

    if(content === false) {
        const element = createUserJoinedElement(userSender);
        chatMessages.appendChild(element);
        chatInput.removeAttribute('disabled');
        chatInput.setAttribute('placeholder', 'Digite sua mensagem');
        chatButton.removeAttribute('disabled');
    } else {

        const message = userSender.id === user.id 
            ? createMessageSelfElement(content) 
            : createMessageOtherElement(userSender.name, userSender.color, content);
        
        chatMessages.appendChild(message);
    }

    scrollScreen();
}

const handleLogin = (e) => {
    e.preventDefault();
    
    user.id = crypto.randomUUID();
    user.name = loginInput.value;
    user.color = getRandomColor();
    
    login.style.display = 'none';
    chat.style.display = 'flex';

    websocket = new WebSocket('wss://chat-backend-r4gx.onrender.com');

    websocket.onmessage = processMessage;

    websocket.onopen = () => websocket.send(JSON.stringify({
        userSender: user.name,
        content: false
    }));

    chatInput.focus();
}

const handleSendMessage = (e) => {
    e.preventDefault();

    const message = {
        userSender: user,
        content: chatInput.value
    }

    websocket.send(JSON.stringify(message));
    
    chatInput.value = '';
}

//wallpapers functions
const showWallpapers = () => {
    wallpapers.style.display = 'flex';
}

const hideWallpapers = () => {
    wallpapers.style.display = 'none';
}

const setWallpaper = (name, color) => {
    body.style.backgroundImage = `url('./images/bg-${name}.jpeg')`;
    chatForm.style.backgroundColor = color;
    window.localStorage.setItem("currentWallpaper", [name, color]);
    hideWallpapers();
}

const storedCurrentWallpaper = window.localStorage.getItem("currentWallpaper");

if(storedCurrentWallpaper) {
    const [ name, color ] = storedCurrentWallpaper.split(',');
    setWallpaper(name, color);
} else {
    setWallpaper('default', '#191919d6');
}

loginForm.addEventListener('submit', handleLogin);

chatForm.addEventListener('submit', handleSendMessage);