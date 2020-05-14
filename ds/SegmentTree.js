class SegmentTree {

    constructor(iterable, operate) {
        // Private members
        this._seg_tree = [];
        this._sentinel = new Object();
        this._operate = function (a, b) {
            if (a == this.sentinel)
                return b;
            else if (b == this.sentinel)
                return a;
            else
                return operate(a, b);
        };
        this._values = [];
        for (const iter of iterable)
            this._values.push(iter);
        this._length = this._values.length;

        // Build segment tree
        this._build(0, this._length - 1, 0);
    }

    // Private Methods
    _left(pos) {
        return 2 * pos + 1;
    }

    _right(pos) {
        return 2 * pos + 2;
    }

    _build(low, high, pos) {
        if (low == high) {
            this._seg_tree[pos] = this._values[low];
            return true;
        }

        let mid = (low + high) >>> 1;
        this._build(low, mid, this._left(pos));
        this._build(mid + 1, high, this._right(pos));
        this._seg_tree[pos] = this._operate(this._seg_tree[this._left(pos)], this._seg_tree[this._right(pos)]);
    }

    _query(query_low, query_high, range_low, range_high, pos) {
        if (range_low >= query_low && range_high <= query_high)
            return this._seg_tree[pos];
        else if (query_high < range_low || range_high < query_low)
            return this.sentinel;
        else {
            let mid = (range_low + range_high) >>> 1;
            let left = this._query(query_low, query_high, range_low, mid, this._left(pos));
            let right = this._query(query_low, query_high, mid + 1, range_high, this._right(pos));
            return this._operate(left, right);
        }
    }

    _update(new_value, index, range_low, range_high, pos) {
        if (range_low == range_high) {
            this._seg_tree[pos] = new_value;
            return this._seg_tree[pos];
        }

        let mid = (range_low + range_high) >>> 1;

        if (index <= mid)
            this._update(new_value, index, range_low, mid, this._left(pos));
        else
            this._update(new_value, index, mid + 1, range_high, this._right(pos));

        this._seg_tree[pos] = this._operate(this._seg_tree[this._left(pos)], this._seg_tree[this._right(pos)]);
    }

    // Public Methods
    query(query_low, query_high) {
        return this._query(query_low, query_high, 0, this._length - 1, 0);
    }

    update(new_value, index) {
        return this._update(new_value, index, 0, this._length - 1, 0);
    }
}

module.exports = SegmentTree;