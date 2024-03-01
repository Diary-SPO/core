import { decode } from "./decode";

for (let i = 0; i < Bun.argv.length; i++) {
  switch (Bun.argv[i]) {
    case "decrypt":
      if (Bun.argv.length <= i + 1) {
        console.log("Вы не указали значение для расшифровки: bun cli decrypt <value>")
        break
      }
      decode(Bun.argv[i + 1])
    break;
  }
}

console.log(
  "Доступны следующие команды:\n"
  + "  bun cli decrypt <value>\n"
)