// run this on https://contacts.google.com/directory while
// logged in to your UCSB account

const names = `<paste the emails you got from get-names.ts here>`.split('\n');

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

var allContacts = []; // save this as contacts.json

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