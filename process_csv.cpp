#include <codecvt>
#include <fstream> 
#include <iostream>
#include <locale>
#include <set>
#include <sstream>
#include <string>
#include <unordered_set>

using namespace std;

bool check(string& word, unordered_set<string>& four) {
    if(word.size() > 12) return false;

    wstring_convert<codecvt_utf8<char32_t>, char32_t> converter;
    u32string utf32 = converter.from_bytes(word);

    set<char32_t> seen;
    for(auto& c : utf32) {
        if(c > 0xFF00) return false;
        if(seen.find(c) != seen.end()) return false;
        seen.insert(c);
    }

    if(seen.size() == 4) {
        string str(seen.begin(), seen.end());
        if(four.find(str) != four.end()) {
            return false;
        }
        four.insert(str);
    }

    return true;
}

int main() {
    ifstream fin("Chinese language database _ 中文数据库 - All Words (Frequency).csv");
    ofstream fout("words.txt");

    string line;
    int skip = 3;
    for(int i = 0; i < skip; i++) {
        getline(fin, line);
    }

    unordered_set<string> four;

    while(getline(fin, line)) {
        stringstream ss(line);
        string word;

        int pos = 3;
        for(int i = 0; i < pos; i++) {
            getline(ss, word, ',');
        }

        if(!check(word, four)) continue;
        
        fout << word << endl;
    }
}