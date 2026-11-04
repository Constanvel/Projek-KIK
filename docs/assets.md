# Asset provenance

Source: Figma KIK-mcp, file `wsbQBOCVHrEwO6GGhLe8Yy`.

| Local file                                 | Reference                                                                           |
| ------------------------------------------ | ----------------------------------------------------------------------------------- |
| hya.png                                    | Illustration node 1:862                                                             |
| hya-avatar-source.png                      | Hya source raster in queue frame 1:910; intentionally cropped in a circular wrapper |
| qr-example.svg                             | Example QR node 1:271, 232 × 232; not a valid hospital ticket                       |
| bell.svg                                   | Queue frame 1:910, 13.8 × 16.8                                                      |
| arrow.svg                                  | Queue frame 1:910, 17.8 × 13.8                                                      |
| home.svg                                   | Queue navigation, 19.8 × 19.8                                                       |
| ticket.svg                                 | Queue navigation, 19.8 × 15.8                                                       |
| user.svg                                   | Queue navigation, 17.8 × 20.8                                                       |
| back.svg, search.svg, heart.svg, check.svg | Main patient frames, 24 × 24                                                        |

Assets were downloaded from temporary MCP asset endpoints. Runtime uses only local files. No full-screen design image is used as UI. SVG intrinsic dimensions are preserved inside 24px control slots. Fonts are self-hosted through `@fontsource/plus-jakarta-sans`; package includes its upstream license.

The UI does not reproduce device status bars or Android gesture bars: those are OS chrome, not browser controls. A demo disclosure occupies the top inset. Dashboard chart data is implemented as an accessible HTML figure with a tabular alternative.
