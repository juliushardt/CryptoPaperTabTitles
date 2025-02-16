# Crypto Research Paper Tab Titles
The `Crypto Research Paper Tab Titles` extension replaces the tab title of PDFs on `eprint.iacr.org`, an archive for cryptographic research papers, with the actual title and author information of the paper at hand. Normally, when you open a research paper on `eprint.iacr.org` with you browser, the tab displays a title such as `055.pdf`. As you open more papers and websites in other tabs, it becomes harder and harder to keep track of the papers you have opened. Moreover, the generic filenames make it difficult to find opened papers using Chrome's tab search feature (Ctrl+Shift+A resp. Cmd+Shift+A) unless you remember the numeric filename of the paper you are looking for.

This extension addresses this problem by automatically replacing the filename-based tab titles with semantically meaningful ones. For example, [https://eprint.iacr.org/2006/281.pdf](https://eprint.iacr.org/2006/281.pdf) gets the tab title `Formalizing Human Ignorance: Collision-Resistant Hashing without the Keys - Phillip Rogaway - 2006/281.pdf` instead of `281.pdf`. All titles set by this extension have the format `<title> - <authors> - <eprintID>.pdf`. Hence, you can use Chrome's tab search feature to search your tabs for a title, an author or even the numeric eprint ID of a paper. (Note that the native tab title is a suffix of the one we assign, providing some sort of backward compatibility.)

This project is NOT affiliated with the International Association for Cryptologic Research (IACR), the Cryptology ePrint Archive and/or its editors.

## Compatibility
This extension is compatible and tested with Chrome and Microsoft Edge (Chromium-based). For the latter, we support both the new **built-in** Adobe Acrobat-powered PDF engine and the legacy PDF engine.
Unfortunately, if you use the `Adobe Acrobat` _extension_ in any of the two browsers, our extension does not work. This is because the Acrobat extension redirects all PDFs to a private extension page and Chromium extensions cannot run code inside of pages of other extensions.

Our extension likely works in other Chromium-based browsers as well (especially in ones which do not modify the built-in PDF viewer), but we do not test the extension in browsers other than Chrome and Edge.

## How it works
After you install the extension and open a PDF on the Cryptology ePrint Archive for the first time, our extension fetches the list of all papers on eprint from `https://eprint.iacr.org/complete/compact`. This list is then stored locally and used for subsequent lookups of titles and author information. When a paper that is not found in the local cache is encountered, we retrieve the list again and update the local cache. Regardless of cache hits and misses, the extension ensures that the list is downloaded at most once every ten minutes. This is a precautionary action to protect the IACR eprint server against high load even if our caching mechanism fails for whatever reason.

Every time you open a research paper on IACR eprint in your browser, the extension retrieves the title and author(s) of the paper (either from its local cache or online, as described above) and then sets the title of the tab to the string `<title> - <authors> - <eprintID>.pdf`. For technical reasons, we have to wait until the PDF is fully loaded before we can update the title of the tab.

## Known issues
* This extension does not work if you use the Adobe Acrobat extension to view PDFs in your browser. As explained above, there is, unfortunately, no way to fix this.

## How to build
### Prerequisites
PowerShell is required to build the extension.
Please refer to  [Install PowerShell on Windows, Linux, and macOS](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell) on learn.microsoft.com for installation instructions.

### Building for Chrome/Edge
Make sure your current working directory is the root folder of this repository and then run `build_Chrome.ps1`.
Afterwards, you can load the extension from `dist/Chrome/CryptoResearchPaperTabTitles`.
To distribute the extension as a ZIP file, run `pack_Chrome.ps1`.
The resulting ZIP archive is saved in `dist/Chrome`.

### Building for Safari
Make sure your current working directory is the root folder of this repository and then run `build_Safari.ps1`.
Afterwards, you can open and run the Xcode project under `native/Safari/CryptoResearchPaperTabTitles`.

### Building the icon
To build the icon, additional prerequisites are needed.
However, if you do not want to modify the icon, you do not need them.
Please refer to the `icon` folder for more details.

## Contributing
Contributions are welcome. For smaller changes, feel free to submit a pull request directly. If you want to contribute a larger change, please open an issue for discussion first.
