# Steps — Builder

1. `CrateSpecBuilder`: one class, private fields for `materialValue`/`lengthCmValue`/
   `widthCmValue`/`heightCmValue`/`maxLoadKgValue`, all `undefined` until set.
2. `.material(m)`/`.dimensions(l, w, h)`/`.maxLoad(kg)`: each stores its value and returns
   `this`, so calls chain.
3. `.build()`: checks every required field is defined, validates dimensions/`maxLoadKg` are
   positive, resolves the fastener from the material, and returns the finished `CrateSpec`.
4. `buildExportCrate`/`buildDomesticCrate`: each a four-call chain -
   `new CrateSpecBuilder().material(...).dimensions(...).maxLoad(...).build()` - differing
   only in which material they pass.
