// Global registry. Each file in interactions/ calls MicroIX.register({...}).
// Plain scripts (not ES modules) so the site works when opened via file://.
window.MicroIX = {
  items: [],
  register(def) {
    this.items.push(def);
  },
};
