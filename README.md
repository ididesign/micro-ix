# micro-ix

A local gallery of micro interactions. Plain HTML/CSS/JS with no build step.

## Run

Open `index.html` directly, or serve it:

```sh
cd ~/micro-ix && python3 -m http.server 8000   # → http://localhost:8000
```

## Add an interaction

1. Create `interactions/<id>.js`:

   ```js
   MicroIX.register({
     id: 'my-thing',
     title: 'My thing',
     description: 'One line on what makes it feel good.',
     tags: ['button'],
     source: { label: 'Inspo ↗', url: 'https://…' }, // optional
     layout: { wide: true, stageHeight: 700 },       // optional: full-width card, taller stage
     css: `.ix-my-thing { … }`,                      // prefix classes with .ix-
     mount(stage) { stage.innerHTML = `…`; },        // stage = the card's demo area
   });
   ```

2. Add `<script src="interactions/<id>.js"></script>` to `index.html` before `js/main.js`.

Shared tokens: `--bg --surface --stage --text --muted --line --accent --accent-2 --ease-out --ease-spring`.
