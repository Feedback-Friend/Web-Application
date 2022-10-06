from ..src.backend.utility import decode, encode
import random

alphanumeric = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"

def test_single():
    s = "a"
    assert encode("a") == "b"
    assert decode("b") == "a"
    assert decode(encode(s)) == s


def test_double():
    s = "ab"
    assert encode("ab") == "bc"
    assert decode("bc") == "ab"
    assert decode(encode(s)) == s


def test_long():
    s = "hello"
    assert decode(encode(s)) == s
    s = "test3"
    assert decode(encode(s)) == s


def test_random():
    length = random.randrange(10, 100)
    s = ""
    for _ in range(length):
        s += random.choice(alphanumeric)
    assert decode(encode(s)) == s


def test_error1():
    s = "abc"
    assert decode(encode(s)) != "bcd"


test_random()