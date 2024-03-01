#!/bin/bash

# Array of languages
languages=('ar' 'bn' 'cs' 'da' 'de' 'el' 'en' 'es' 'fa' 'fi' 'fil' 'fr' 'he' 'hi' 'hu' 'id' 'it' 'ja' 'ko' 'mr' 'nl' 'no' 'pl' 'pt' 'ro' 'ru' 'sq' 'sv' 'te' 'th' 'tr' 'uk' 'ur' 'vi' 'zh')

# Create directories and default.json files
for lang in "${languages[@]}"; do
    mkdir -p "$lang"
    touch "$lang/default.json"
done
