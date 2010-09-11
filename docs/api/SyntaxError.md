# SyntaxError

Syntax Errors are generated during document parsing. Recoverable errors will be
pushed to an array on the document (Document#errors). Fatal errors will be
thrown and will need to be caught.

### Properties


#### error.domain

>What part of the library raised this error

>**returns**  a Number or null

#### error.code

>The error code

>**returns**  a Number or null

#### error.message

>human-readable informative error message

>**returns**  a String or null

#### error.level

>how consequent is the error

>**returns**  a Number or null

#### error.file

>the filename

>**returns**  a String or null

#### error.line

>the line number if available

>**returns**  a Number or null

#### error.str1

>extra string information

>**returns**  a String or null

#### error.str2

>extra string information

>**returns**  a String or null

#### error.str3

>extra string information

>**returns**  a String or null

#### error.int1

>extra number information

>**returns**  a Number or null

#### error.column

>column number of the error or 0 if N/A

>**returns**  a Number

