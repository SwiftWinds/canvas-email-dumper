// run this on https://contacts.google.com/directory while
// logged in to your UCSB account

const names = `<paste the emails you got from get-names.js here>`.split("\n");

function* pairwise(arr, skips = 1) {
  for (let i = 0; i < arr.length - 1; i += skips) {
    yield [arr[i], arr[i + 1]];
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
      console.log(name);
      const [firstName, lastName] = name.split(" ");
      const res = await fetch(
        "https://contacts.google.com/_/ContactsUi/data/batchexecute?rpcids=W5YB6b&source-path=%2Fdirectory&f.sid=5016045903193037906&bl=boq_contactsuiserver_20240121.03_p0&hl=en&soc-app=527&soc-platform=1&soc-device=1&_reqid=1559226&rt=c",
        {
          headers: {
            accept: "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
            "sec-ch-ua":
              '"Not_A Brand";v="8", "Chromium";v="120", "Microsoft Edge";v="120"',
            "sec-ch-ua-arch": '"x86"',
            "sec-ch-ua-bitness": '"64"',
            "sec-ch-ua-full-version": '"120.0.2210.144"',
            "sec-ch-ua-full-version-list":
              '"Not_A Brand";v="8.0.0.0", "Chromium";v="120.0.6099.234", "Microsoft Edge";v="120.0.2210.144"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-model": '""',
            "sec-ch-ua-platform": '"macOS"',
            "sec-ch-ua-platform-version": '"14.1.1"',
            "sec-ch-ua-wow64": "?0",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-same-domain": "1",
          },
          referrer: "https://contacts.google.com/",
          referrerPolicy: "origin",
          body: `f.req=%5B%5B%5B%22W5YB6b%22%2C%22%5B%5C%22${firstName}%20${lastName}%5C%22%5D%22%2Cnull%2C%22generic%22%5D%5D%5D&at=AGDSmKsFNgWwxy4G2TOumG5IMLYi%3A1706056023863&`,
          method: "POST",
          mode: "cors",
          credentials: "include",
        }
      );
      const data = await res.text();
      console.log(data);
      const rawContacts = data.split("null,null,null,null,null,1]");
      rawContacts.shift();

      let contacts = [];
      for (const [rawName, rawEmail] of pairwise(rawContacts, 2)) {
        const name = rawName.match(/\\"(.*?)\\"/)[1];
        const emails = [
          ...rawEmail.matchAll(/\\"([^\]\[\\]*?@[^\]\[\\]*?)\\"/g),
        ].map((m) => m[1]);
        contacts.push({
          name,
          emails,
        });
      }

      contacts = contacts.filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (t) => t.name === value.name && arraysEqual(t.emails, value.emails)
          )
      );

      contacts = contacts.filter(
        (contact) =>
          contact.name.toLowerCase().trim() === name.toLowerCase().trim()
      );

      allContacts.push(contacts);
    } catch (e) {
      console.error("Error:", name);
      console.log(e);
    }
    await new Promise((r) => setTimeout(r, 1000));
  }

  allContacts = allContacts.map((contact, i) => {
    return {
      missing: !contact.length,
      name: names[i],
      possibilities: contact.map((possibility) => possibility.emails),
    };
  });
}

main();
