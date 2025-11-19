from cryptography.fernet import Fernet
from decouple import config

fernet = Fernet(config('FERNET_KEY'))

def message_encrypt(message:str)->str:
  return fernet.encrypt(message.encode('utf-8')).decode('utf-8')

def message_decrypt(message:str)->str:
  return fernet.decrypt(message.encode('utf-8')).decode('utf-8')