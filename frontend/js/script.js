//login elements
const login = document.querySelector('.login');
const loginForm = login.querySelector('.login__form');
const loginInput = login.querySelector('.login__input');

//chat elements
const chat = document.querySelector('.chat');
const chatForm = chat.querySelector('.chat__form');
const chatInput = chat.querySelector('.chat__input');
const chatMessages = chat.querySelector('.chat__messages');

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

const user = { id: "", name: "", color: "" }

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

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

const processMessage = ({ data }) => {
    const { userSender, content } = JSON.parse(data);

    if(userSender.id === user.id) {
        const element = createMessageSelfElement(content);
        chatMessages.appendChild(element);
    } else {
        const element = createMessageOtherElement(userSender.name, userSender.color, content);
        chatMessages.appendChild(element);
    }
}

const handleLogin = (e) => {
    e.preventDefault();
    
    user.id = crypto.randomUUID();
    user.name = loginInput.value;
    user.color = getRandomColor();
    
    login.style.display = 'none';
    chat.style.display = 'flex';

    websocket = new WebSocket('ws://localhost:8080');
    websocket.onmessage = processMessage;
}

const sendMessage = (e) => {
    e.preventDefault();

    const message = {
        userSender: user,
        content: chatInput.value
    }

    websocket.send(JSON.stringify(message));
    
    chatInput.value = '';
}

loginForm.addEventListener('submit', handleLogin);

chatForm.addEventListener('submit', sendMessage);