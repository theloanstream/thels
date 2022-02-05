from brownie import MockToken, Thels, Contract
from brownie.network.account import Account

from scripts.helpful_scripts import get_account, get_contract


def allow(thels: str, token: str, account: Account = get_account()):
    usdc = Contract.from_abi(
        MockToken._name,
        get_contract(token),
        MockToken.abi,
    )
    tx = usdc.approve(thels, (2 ** 256) - 1, {"from": account})
    tx.wait(1)
    return tx


def main():
    account = get_account()

    # Allow UNI
    print("Allowing UNI...")
    allow(Thels[-1], "uni_token", account)
    print("Allowed.")

    # Allow USDC
    print("Allowing USDC...")
    allow(Thels[-1], "usdc_token", account)
    print("Allowed.")
