const names = `Rithwik Adicherla
Safiya Alavi
Arian Alavi
Chase Alcorn
Kirill Aristarkhov
Nirmit Ashar
Michael Atkinson
Rohil Bajaj
Luis Barajas
Corinna Basch
Mac Beggs
Eustolia Beltran
Sam Boersma
Max Bonham
Jessica Cai
Tufei Cai
Josh Calpe
Alex Cano
Angelina Cao
Siyu Cao
Alexander Carbone
Dylan Cervantes
Justin Chang
Brian Chang
Timothy Chang
Marvin Chang
Christopher Chang
Zhimei Chen
Jiakang Chen
Jiayue Chen
Melody Chen
Yanzhao Chen
Kaie Chen
Sophia Cheng
Arik Cheslog
Irene Cho
Alex Cho
Steven Choi
Darren Chou
Jason Chou
Dylan Chung
Yoonji Chung
Jared Connolly
Bernie Conrad
Jackson Cooley
Isaiah de la Rosby
Vinay Dharasker
Chloe Dinh-Luong
Jimmy Dysart
Tara Ellingson
Jocelyn Enriquez
Eric Feng
Jared Fitton
Lawrence Gao
Long Gao
Wentao Gao
Christian Garduno
Ishan Gondara
Archit Gupta
Giovani Gutierrez
Maya Ha
Ryan Haley
Quinn Hamilton
Eric Han
Xinyi Han
Wei He
Christian He
Kyle He
Kevin Heo
Emma Herreros de Tejada
Mykele Hill
Ethan Hill
Brian Ho
Isaac Hoffman
Michael Hong
Rui Hu
chenyu Hua
Allison Huang
Jiashu Huang
Alberto Huang He
Ashley Hurdle
Ran Ji
Shawn Jiang
Shuaiming Jing
Marie Karpinska
Rohit Kavuluru
Yejin Kim
Hyomin Kim
Allison Kim
Valentina Komarov
Chris Kracha
Julie Ku
Michael Kuhn
Misha Kulshresta
Hannah Kwon
Justin Lai
Kevin Lai
Kristal Lam
Edward Lam
KAI Lan
Michael Lang
Junhwan Lee
Matthew Lee
Anpeng Lei
Ryan Lewis
William Li
Yuanning Li
Ramone Li
Jeremy Li
Junyuan Li
Yaxin Li
Yibo Liang
Sarah Liang
Angela Liang
Sylvia Lin
Rose Lin
Ray Ling
Leslie Liu
Shengjian Liu
Jack Liu
Joel Lu
Zhongnan Luo
Amy Lyu
Andrew Marabante
Elena Markova
Zack Marks
Nathan Mathew
Eve McCreary
Samuel Metta
Andres Miguel
Zach Miller
Harold Mo
Patrick Moon
Alec Morrison
Mauricio Munoz Valtierra
Aapthi Nagesh
Nga Ngo
Andrew Nguyen
Jesse Nunez
Patrick Omens
Alysha Osbakken
Amin Parvizi
Terry Pi
Nimisha Prasad
Navneet Rajagopal
Blake Randle
Zack Reardon
Kaylin Roberts
Josiah Ross
Colton Rowe
Allen Shim
Ryan Simone
Arjun Singh
Maya Sinha
Bisman Sodhi
Haopeng Song
Jake Stenger
Cindy Su
Adam Tatarkhanov
Rui Tian
Uyen Tran
Kenny Tran
Andrew Tran
Rowan Tran
Piero Trujillo
Fluellen Arman Umali
Jakob Vanderaa
Genevieve Varela
Tyler Vu
Mateo Wang
Kenny Wang
Bonny Wang
Jianghua Wang
Lucas Watkins
Ian Wen
Kevin Weng
Davis Westover
Regan Wheatley
Ellen Whitehead
Michael Willis
Kyle Wu
Melanie Wu
Yizhou Wu
Hao Wu
Grace Wu
Yike Wu
Yuhang Wu
Andrew Xi
Pengwei Xia
Shawn Xiao
Carl Xiong
Yipeng Xu
Yifan Xu
Jingyan Xu
Rex Xu
Jennice Xu
Yusong Yan
Mena Yang
Lucky Ye
Luke Yoffe
Tongxi Yu
Christy Yu
Riley Zamora
Colby Zeljak
Shujie Zhang
Belle Zhang
Kevin Zhang
Chris Zhang
Belle Zhang
Han Zhang
Ellin Zhao
Yijia Zhao
Cecily Zheng
Dingfan Zheng
Mia Zhou
Ke Zhou
Eric Zhu
Qichen Zhu
Bowen Zhu`.split('\n');

function* pairwise(arr, skips = 1) {
    for (let i = 0; i < arr.length - 1; i += skips) {
        yield [arr[i], arr[i + 1]]
    }
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

var allContacts = [];

async function main() {
  for (const name of names) {
    try {
      console.log(name)
      const [firstName, lastName] = name.split(' ')
      const res = await fetch(`https://contacts.google.com/_/ContactsUi/data/batchexecute?rpcids=yzdkcf&source-path=%2Fsearch%2F${firstName}%2520${lastName}&f.sid=9221173225450657360&bl=boq_contactsuiserver_20220524.07_p0&hl=en&soc-app=527&soc-platform=1&soc-device=1&_reqid=2956110&rt=c`, {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:101.0) Gecko/20100101 Firefox/101.0",
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.8,es;q=0.6,zh-CN;q=0.4,zh;q=0.2",
            "X-Same-Domain": "1",
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin"
        },
        "referrer": "https://contacts.google.com/",
        "body": `f.req=%5B%5B%5B%22yzdkcf%22%2C%22%5B%5C%22${firstName}%20${lastName}%5C%22%5D%22%2Cnull%2C%221%22%5D%5D%5D&at=ACHfmarman8st7S1xHz8lWNMCE6C%3A1653950108405&`,
        "method": "POST",
        "mode": "cors"
      });
      const data = await res.text();
      console.log(data)
      const rawContacts = data.split('null,null,null,null,null,1]');
rawContacts.shift();
      
      let contacts = [];
      for (const [rawName, rawEmail] of pairwise(rawContacts, 2)) {
          const name = rawName.match(/\\"(.*?)\\"/)[1];
          const emails = [...rawEmail.matchAll(/\\"([^\]\[\\]*?@[^\]\[\\]*?)\\"/g)].map(m => m[1]);
          contacts.push({
              name,
              emails
          })
      }
      
      contacts = contacts.filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.name === value.name && arraysEqual(t.emails, value.emails)
        ))
      )
      
      contacts = contacts.filter(contact => contact.name.toLowerCase().trim() === name.toLowerCase().trim())
      
      allContacts.push(contacts)
    } catch (e) {
      console.error("Error:", name)
      console.log(e)
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  allContacts = allContacts.map((contact, i) => {
    return {
      missing: !contact,
      name: names[i],
      possibilities: contact.map(possibility => possibility.emails)
    }
  })
}

main()