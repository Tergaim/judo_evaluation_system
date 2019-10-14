

export class Client {

    static getData(url: string): Promise<[boolean, any]> {
        return fetch(url).then(val => Promise.all([val.ok, val.json()]));
    }

    static postData(url: string, data: Object, expectData: boolean = false): Promise<[boolean, any]> {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then(res => Promise.all([ res.ok, expectData ? res.json() : {} ]));
    }

}