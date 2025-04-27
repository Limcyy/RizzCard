import shyEmoji from '../assets/shy-emoji.png'
import formalCat from '../assets/formal-cat.png'
import cuteCat from '../assets/cute-cat.png'
import sleepingCat from '../assets/sleeping-cat.png'
import cookCat from '../assets/cook-cat.png'
import workOutCat from '../assets/work-out-cat.png'
import sigmaPhoto from '../assets/sigma-photo.png'
import sideEyeCat from '../assets/side-eye-cat.png'
import krystof from '../assets/krystofrizz.png'
import musicFile from '../assets/good-night-lofi.mp3'
import musiccat from '../assets/musiccat.png'

export const AdamCards = [
  {
    title: "Wsup Girl",
    image: cuteCat,
    button: "null"
  },
  {
    title: "Waaaait, are you a girl?",
    image: sideEyeCat,
    button: "yep 💕",
    button2: "nah 👨🏽",
    link: "https://www.youtube.com/shorts/dSRAXW2mqvc",
  },
  {
    title: "Uff, and are u over 14, and under 18?",
    image: cookCat,
    button: "yes",
    button2: "no",
    link: "https://www.youtube.com/watch?v=KTs-LhnUMFs&ab_channel=Krtek/TheMole",
  },
  {
    title: "Anddd are u single?",
    image: sleepingCat,
    button: "yea ❤️",
    button2: "nah D:",
    link: "https://www.youtube.com/watch?v=bxzYqcArh_s&ab_channel=JoeyKidney",
  },
  {
    title: "Then you at the right place bby, text me 🤙🏾",
    image: sigmaPhoto,
    button: "instagram",
    link: "https://www.instagram.com/_adam_rana_?igsh=Y2lndjEycnQ1bGVv&utm_source=qr"
  }
]

export const playMusic = () => {
  const audio = new Audio(musicFile);
  audio.play();
};


export const KrystofCards = [
  {
    title: "Press play and let's hear some music! 🎶",
    image: musiccat,
    button: "music",
    action: playMusic,

  },
  {
    title: "You just scanned a secret heart... ❤️ Ready to get to know me a little?",
    image: shyEmoji,
    button: "null"
  },
  {
    title: "Hi, I'm Krystof 😊",
    image: shyEmoji,
    button: "null"
  },
  {
    title: "You're kinda stuck with me now... because I'll need this card back. 😏",
    image: formalCat,
    button: "null"
  },
  {
    title: "Maybe you would like to know a little something about me....",
    image: cuteCat,
    button: "null"
  },
  {
    title: "Fun fact: I'm 87% coffee and 13% bad jokes.",
    image: sideEyeCat,
    button: "null"
  },
  {
    title: "Believe it or not, I sometimes sleep. Mostly at night. 😴",
    image: sleepingCat,
    button: "null"
  },
  {
    title: "I can cook for you... if you're lucky 🍳😉",
    image: cookCat,
    button: "null"
  },
  {
    title: "I work out — mainly so I can hold the door open for you with a smile 😎💪",
    image: workOutCat,
    button: "null"
  },
  {
    title: "And yeah... you should definitely text me. ✉️💬",
    image: krystof,
    button: "instagram",
    link: "https://www.instagram.com/krystoh._?igsh=MWtyZnB0YWpvdWRrbA=="
  }
];


export const FilipCards = [
  {
    title: "Ahoj jsem Fílda",
    image: shyEmoji,
    button: "null"
  },
  {
    title: "And im def gonna need the card back so we better meet up again",
    image: formalCat,
    button: "null"
  },
  {
    title: "Maybe you would like to know a little something about me....",
    image: cuteCat,
    button: "null"
  },
  {
    title: "sometimes i sleep(usually at night)",
    image: sleepingCat,
    button: "null"
  },
  {
    title: "i can cook for you ;)",
    image: cookCat,
    button: "null"
  },
  {
    title: "I work out",
    image: workOutCat,
    button: "null"
  },
  {
    title: "And yeahhh, please text me",
    image: workOutCat,
    button: "instagram",
    link: "https://www.instagram.com/_adam_rana_?igsh=Y2lndjEycnQ1bGVv&utm_source=qr"
  }
]

