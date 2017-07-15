#!/usr/bin/env python
# coding=utf-8
"""
coding=utf-8

A utility to make handling many resumes easier by automatically pulling contact information, required skills and
custom text fields. These results are then surfaced as a convenient summary CSV.

"""

import functools
import logging
import re
import sys
from flask import Flask
from flask_restful import reqparse, abort, Api, Resource
import requests
import pandas as pd

reload(sys)
sys.setdefaultencoding('utf8')

app = Flask(__name__)
api = Api(app)

logging.basicConfig(level=logging.DEBUG)

'''
def main():
    """
    Main method for ResumeParser. This utility will:
     - Read in `data_path` and `output_path` from command line arguments
     - Create a list of documents to scan
     - Read the text from those documents
     - Pull out desired information (e.g. contact info, skills, custom text fields)
     - Output summary CSV

    :return: None
    :rtype: None
    """
    logging.info('Begin Main')

    url = 'http://achung.me/RahulSabnisResume-1.png'
    resume_df = create_resume_df(url)

    # Output to CSV
    writer = pd.ExcelWriter('output.xlsx')
    resume_df.to_excel(writer, 'Sheet1')
    writer.save()
    logging.info('End Main')
'''


def check_phone_number(string_to_search):
    """
    Find first phone number in the string_to_search
    :param string_to_search: A string to check for a phone number in
    :type string_to_search: str
    :return: A string containing the first phone number, or None if no phone number is found.
    :rtype: str
    """
    try:
        regular_expression = re.compile(r"\(?"  # open parenthesis
                                        r"(\d{3})?"  # area code
                                        r"\)?"  # close parenthesis
                                        r"[\s\.-]{0,2}?"  # area code, phone separator
                                        r"(\d{3})"  # 3 digit exchange
                                        r"[\s\.-]{0,2}"  # separator bbetween 3 digit exchange, 4 digit local
                                        r"(\d{4})",  # 4 digit local
                                        re.IGNORECASE)
        result = re.search(regular_expression, string_to_search)
        if result:
            result = result.groups()
            result = "-".join(result)
        return result
    except Exception, exception_instance:
        logging.error('Issue parsing phone number: ' + string_to_search + str(exception_instance))
        return None


def check_email(string_to_search):
    """
       Find first email address in the string_to_search
       :param string_to_search: A string to check for an email address in
       :type string_to_search: str
       :return: A string containing the first email address, or None if no email address is found.
       :rtype: str
       """
    try:
        regular_expression = re.compile(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}", re.IGNORECASE)
        result = re.search(regular_expression, string_to_search)
        if result:
            result = result.group()
        return result
    except Exception, exception_instance:
        logging.error('Issue parsing email number: ' + string_to_search + str(exception_instance))
        return None


def check_address(string_to_search):
    """
       Find first physical address in the string_to_search
       :param string_to_search: A string to check for a physical address in
       :type string_to_search: str
       :return: A string containing the first address, or None if no physical address is found.
       :rtype: str
       """
    try:
        regular_expression = re.compile(r"[0-9]+ [a-z0-9,\.# ]+\bCA\b", re.IGNORECASE)
        result = re.search(regular_expression, string_to_search)
        if result:
            result = result.group()

        return result
    except Exception, exception_instance:
        logging.error('Issue parsing email number: ' + string_to_search + str(exception_instance))

        return None


def term_count(string_to_search, term):
    """
    A utility function which counts the number of times `term` occurs in `string_to_search`
    :param string_to_search: A string which may or may not contain the term.
    :type string_to_search: str
    :param term: The term to search for the number of occurrences for
    :type term: str
    :return: The number of times the `term` occurs in the `string_to_search`
    :rtype: int
    """
    try:
        regular_expression = re.compile(term, re.IGNORECASE)
        result = re.findall(regular_expression, string_to_search)
        return len(result)
    except Exception, exception_instance:
        logging.error('Issue parsing term: ' + str(term) + ' from string: ' + str(
            string_to_search) + ': ' + str(exception_instance))
        return 0


def term_match(string_to_search, term):
    """
    A utility function which return the first match to the `regex_pattern` in the `string_to_search`
    :param string_to_search: A string which may or may not contain the term.
    :type string_to_search: str
    :param term: The term to search for the number of occurrences for
    :type term: str
    :return: The first match of the `regex_pattern` in the `string_to_search`
    :rtype: str
    """
    try:
        regular_expression = re.compile(term, re.IGNORECASE)
        result = re.findall(regular_expression, string_to_search)
        return result[0]
    except Exception, exception_instance:
        logging.error('Issue parsing term: ' + str(term) + ' from string: ' +
                      str(string_to_search) + ': ' + str(exception_instance))
        return None


def get_text_image(url):
    URL = "https://vision.googleapis.com/v1/images:annotate?key="
    API = "AIzaSyAOrix8jeIDIJ9wVNufSqmIwCAgskcEoA8"
    payload = {
        "requests": [
            {
                "image": {
                    "source": {
                        "imageUri":
                            url
                    }
                },
                "features": [
                    {
                        "type": "TEXT_DETECTION"
                    }
                ]
            }
        ]
    }

    r = requests.post(URL + API, json=payload)
    j = r.json()
    text = j['responses'][0]['fullTextAnnotation']['text']
    return text.replace('\n', ' ')


def create_resume_df(url):
    """

    This function creates a Pandas DF with one row for every input resume, and columns including the resumes's
    file path and raw text.

    This is achieved through the following steps:
     - Create a list of documents to scan
     - Read the text from those documents
     - Pull out desired information (e.g. contact info, skills, custom text fields)
    :param data_path: Path to a folder containing resumes. Any files ending in .pdf in this folder will be treated as a
    resume.
    :type data_path: str
    :return: A Pandas DF with one row for every input resume, and columns including the resumes's
    file path and raw text
    :rtype: pd.DataFrame
    """
    resume_summary_df = pd.DataFrame()
    # Store metadata, raw text, and word count
    resume_summary_df["raw_text"] = [get_text_image(url)]
    resume_summary_df["num_words"] = resume_summary_df["raw_text"].apply(lambda x: len(x.split()))

    # Scrape contact information
    resume_summary_df["phone_number"] = resume_summary_df["raw_text"].apply(check_phone_number)
    resume_summary_df["area_code"] = resume_summary_df["phone_number"].apply(
        functools.partial(term_match, term=r"\d{3}"))
    resume_summary_df["email"] = resume_summary_df["raw_text"].apply(check_email)
    resume_summary_df["email_domain"] = resume_summary_df["email"].apply(functools.partial(term_match, term=r"@(.+)"))
    resume_summary_df["address"] = resume_summary_df["raw_text"].apply(check_address)
    resume_summary_df["linkedin"] = resume_summary_df["raw_text"].apply(functools.partial(term_count, term=r"linkedin"))
    resume_summary_df["github"] = resume_summary_df["raw_text"].apply(functools.partial(term_count, term=r"github"))

    # Scrape education information
    resume_summary_df["phd"] = resume_summary_df["raw_text"].apply(functools.partial(term_count, term=r"ph.?d.?"))

    # Scrape skill information
    resume_summary_df["java_count"] = resume_summary_df["raw_text"].apply(functools.partial(term_count, term=r"java"))
    resume_summary_df["python_count"] = resume_summary_df["raw_text"].apply(
        functools.partial(term_count, term=r"python"))
    resume_summary_df["R_count"] = resume_summary_df["raw_text"].apply(functools.partial(term_count, term=r" R[ ,]"))
    resume_summary_df["latex_count"] = resume_summary_df["raw_text"].apply(functools.partial(term_count, term=r"latex"))
    resume_summary_df["stata_count"] = resume_summary_df["raw_text"].apply(functools.partial(term_count, term=r"stata"))
    resume_summary_df["CS_count"] = resume_summary_df["raw_text"].apply(
        functools.partial(term_count, term=r"computer science"))
    resume_summary_df["mysql_count"] = resume_summary_df["raw_text"].apply(functools.partial(term_count, term=r"mysql"))
    resume_summary_df["ms_office"] = resume_summary_df["raw_text"].apply(
        functools.partial(term_count, term=r"microsoft office"))
    resume_summary_df["analytics"] = resume_summary_df["raw_text"].apply(
        functools.partial(term_count, term=r"analytics"))

    # Return enriched DF
    print resume_summary_df
    return resume_summary_df


parser = reqparse.RequestParser()
parser.add_argument('url')


class Parse(Resource):
    def post(self):
        args = parser.parse_args()
        try:
            url = args['url']
            resume_df = create_resume_df(url)
            return resume_df.to_json(), 201
        except:
            return "invalid url?", 400


api.add_resource(Parse, '/parse')

if __name__ == '__main__':
    app.run(debug=True)
