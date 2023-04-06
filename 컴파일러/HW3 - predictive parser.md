# HW 3

 [HW3.pdf](자료\HW3.pdf) 



(1) 프로그램 주요 자료 구조 설명

 

입력에 사용되는 변수

string inputTerminals;

 

Parser에 사용되는 변수

int parsingTable[][]; 

stack<char> Stack; char stackTop; 

stack<char> Input; char inputTop; 

int grammar; 

 

출력에 사용되는 변수

int Step;

stack<char> Stack;

stack<char> Input;

string Action;

string Parse;

 

 

 

(2) 프로그램 코드 간단 설명

 

main > getline(cin, inputTerminals) > runPDP(inputTerminals)

runPDP > 

while (true) 

if (Stack.empty() || Input.empty()) return; 

 

// pop & advance 

if (stackTop == inputTop)

Stack.pop(); Input.pop();

 

// expand 

else

int grammar = parsingTable[stackTop][inputTop]; 

runGrammar(Stack, grammar);

 

runGrammar > 

switch (num)

case 1: // S --> aS

case 2: // S --> bA

case 3: // A --> d

case 4: // A --> ccA

default: // ERROR

 

(3) 프로그램 실행 과정 설명 

main > getline > runPDP 

runPDP > init parsingTable > init variables

while ( allStacksNotEmpty ) 

if (stackTop == inputTop) // pop & advance 

else runGrammar // expand

runGrammar > 

switch case by grammarNumber

![HW3-김현학](C:\Users\sean0\Downloads\컴파일러\자료\HW3-김현학.png)