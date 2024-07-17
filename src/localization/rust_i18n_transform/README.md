# Localization for Rust backend
To have the Rust backend of the [Tauri](https://tauri.app) application to use the same localization data, transform the [i18next](https://www.i18next.com) localization files by installing the crate [rust-i18n](https://crates.io/crates/rust-i18n):
```
cargo add rust-i18n
```

## Transform the localization to different format
To transform the localization from *[PATH]/src/localization* into the *[PATH]/src-tauri/locales* for the backend to use, run in the *[PATH]/src/localization/rust_i18n_transform* folder:
```
npm run buildRun
```

## Use the localizations in the backend
1. Insert the following code to the `lib.rs` file:
```rust
#[macro_use]
extern crate rust_i18n;
i18n!();   
```

2. Use the macro in the respective file

```rust
use rust_i18n::t;
```

3. Sample usage

```rust
fn my_error(file_name: &str) -> String {
    let msg = t!("messages.updateCheckFailedFile", error = file_name).into_owned();
    msg
}
```

## See also
* [rust-i18n GitHub](https://github.com/longbridgeapp/rust-i18n) 
