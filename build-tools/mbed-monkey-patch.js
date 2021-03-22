const mbed_retarget_dev_t_find = `
#if defined(TARGET_SIMULATOR)
#include <sys/stat.h>

#define _HAS_STAT_H_

typedef unsigned int  mode_t;   ///< Mode for opening files
typedef unsigned int  dev_t;    ///< Device ID type
#ifndef TARGET_SIMULATOR
typedef unsigned int  nlink_t;  ///< Number of links to a file
#endif
typedef unsigned int  uid_t;    ///< User ID
typedef unsigned int  gid_t;    ///< Group ID
#endif
`;

const mbed_retarget_dev_t_replace = `
#if defined(TARGET_SIMULATOR)
#include <sys/stat.h>

#define _HAS_STAT_H_

typedef unsigned int  mode_t;   ///< Mode for opening files
#if defined(LSP_INDEX_ONLY)
typedef unsigned long dev_t;   ///< Device ID type
#else
typedef unsigned int  dev_t;   ///< Device ID type
#endif
#ifndef TARGET_SIMULATOR
typedef unsigned int  nlink_t;  ///< Number of links to a file
#endif
typedef unsigned int  uid_t;    ///< User ID
typedef unsigned int  gid_t;    ///< Group ID
#endif
`;

const mbed_retarget_path = require("path").resolve(
  __dirname,
  "..",
  "mbed-simulator-hal/mbed-os/platform/mbed_retarget.h"
);
const mbed_retarget_h = require("fs")
  .readFileSync(mbed_retarget_path)
  .toString()
  .replace(mbed_retarget_dev_t_find, mbed_retarget_dev_t_replace);

require("fs").writeFileSync(mbed_retarget_path, mbed_retarget_h);

console.log(mbed_retarget_h);
