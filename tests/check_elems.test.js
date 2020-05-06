const Differencify = require("differencify");
const differencify = new Differencify({ mismatchThreshold: 0 });
let urlToTest = "http://127.0.0.1:8080/";

describe("Zadanie nr. 2", () => {
  const timeout = 30000;
  let page;

  beforeAll(async () => {
    await differencify.launchBrowser({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const target = differencify.init({ chain: false });
    page = await target.newPage();
    await page.goto(urlToTest);
    await page.waitFor(1000);
  }, timeout);
  afterAll(async () => {
    await differencify.cleanup();
  });

  it("Dodano nieuporządkowaną listę", async () => {
    const ol = await page.$eval("ul", elem => !!elem);
    expect(ol).toBe(true);
  }, timeout);

  it("Dodano 5 elementów listy", async () => {
    const ol = await page.$$eval("ul li", elems => elems.length === 5);
    expect(ol).toBe(true);
  }, timeout);

  it("Każdy LI ma kolejną literę alfabetu", async () => {
    const listItems = await page.$$eval("ul li", elems => {
      return elems[0].innerText.toLowerCase() === "a"
        && elems[1].innerText.toLowerCase() === "b"
        && elems[2].innerText.toLowerCase() === "c"
        && elems[3].innerText.toLowerCase() === "d"
        && elems[4].innerText.toLowerCase() === "e"
    });
    expect(listItems).toBe(true);
  }, timeout);

  it("Każdy parzysty LI ma odpowiedni kolor", async () => {
    const listItems = await page.$$eval("ul li", elems => {
      return getComputedStyle(elems[1]).textAlign === "center"
        && getComputedStyle(elems[3]).textAlign === "center"
    });
    expect(listItems).toBe(true);
  }, timeout);
});
